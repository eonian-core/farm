// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/math/Math.sol";

import "./ILender.sol";

abstract contract Lender is ILender {
    struct BorrowerData {
        // Timestamp of the block in which the borrower was activated
        uint256 activationTimestamp;
        // Amount of tokens taken by the borrower
        uint256 debt;
        // Maximum portion of the loan that the borrower can take (in BPS)
        // Represents credibility of the borrower
        uint256 debtRatio;
    }

    uint256 constant MAX_BPS = 10_000;

    // Amount of tokens that all borrowers have taken
    uint256 internal _totalDebt = 0;

    // Debt ratio for the Lender across all borrowers (in BPS, <= 10k)
    uint256 internal _debtRatio = 0;

    // Determines the lender's operating status. If "true", borrowers cannot take any loans
    bool internal _isHalted = false;

    // Records with information on each borrower using the lender's services
    mapping(address => BorrowerData) public borrowersData;

    modifier onlyBorrowers() {
        require(borrowersData[msg.sender].activationTimestamp > 0, "!borrower");
        _;
    }

    /// @notice Returns the number of tokens the borrower (caller of this function) can take from the lender
    /// @return Available credit as amount of tokens
    function getAvailableCredit() external view override returns (uint256) {
        return _getAvailableCredit(msg.sender);
    }

    /// @notice Returns the outstanding debt that the borrower (caller of this function) must repay
    /// @return Outstanding debt as amount of tokens
    function getOutstandingDebt() external view override returns (uint256) {
        return _getOutstandingDebt(msg.sender);
    }

    function reportDebtMaintainingResult(
        uint256 extraFreeFunds,
        uint256 remainingOutstandingDebt
    ) external override onlyBorrowers returns (uint256) {
        uint256 outstandingDebt = _getOutstandingDebt(msg.sender);

        // Reported "remaining" debt may be greater than outstanding debt if the borrower incurs losses that it cannot cover
        uint256 debtPaid = remainingOutstandingDebt <= outstandingDebt
            ? outstandingDebt - remainingOutstandingDebt
            : 0;

        // Checking whether the borrower is telling the truth about his available funds
        require(
            _getBorrowerFreeAssets(msg.sender) >= extraFreeFunds + debtPaid
        );

        // If the borrower still has outstanding debt, we should reduce the level of confidence in him
        if (remainingOutstandingDebt > 0) {
            _decreaseBorrowerCredibility(msg.sender, remainingOutstandingDebt);
        }

        // TODO: Assess n' pay management fees here

        // Recalculate the outstanding debt after the ratio is reduced and fees are assessed (if any)
        // TODO: [Compare gas consumption] Return ratio delta from "_decreaseBorrowerCredibility" and multiple by declared "outstandingDebt"
        outstandingDebt = _getOutstandingDebt(msg.sender);
        debtPaid = Math.min(debtPaid, outstandingDebt);

        // Calculate the amount of credit the lender can provide to the borrower
        uint256 availableCredit = _getAvailableCredit(msg.sender);

        if (debtPaid > 0) {
            borrowersData[msg.sender].debt -= debtPaid;
            _totalDebt -= debtPaid;
        }

        if (availableCredit > 0) {
            borrowersData[msg.sender].debt += availableCredit;
            _totalDebt += availableCredit;
        }

        uint256 freeBorrowerBalance = extraFreeFunds + debtPaid;
        if (freeBorrowerBalance < availableCredit) {
            _transferFundsToBorrower(
                msg.sender,
                availableCredit - freeBorrowerBalance
            );
        } else if (freeBorrowerBalance > availableCredit) {
            _takeFundsFromBorrower(
                msg.sender,
                freeBorrowerBalance - availableCredit
            );
        }

        return 0;
    }

    /// @notice Returns the unrealized amount of the lender's tokens (lender's contract balance)
    function _getFreeAssets() internal view virtual returns (uint256);

    /// @notice Returns the unrealized amount of the borrower's tokens (contract balance of the specified borrower)
    function _getBorrowerFreeAssets(address borrower)
        internal
        view
        virtual
        returns (uint256);

    /// @notice Transfers a specified amount of tokens to the borrower
    function _transferFundsToBorrower(address borrower, uint256 amount)
        internal
        virtual;

    /// @notice Takes a specified amount of tokens from the borrower
    function _takeFundsFromBorrower(address borrower, uint256 amount)
        internal
        virtual;

    /// @notice Returns the total amount of all tokens (including those on the contract balance and taken by borrowers)
    function _getTotalAssets() internal view returns (uint256) {
        return _getFreeAssets() + _totalDebt;
    }

    /// @notice Returns the total number of tokens borrowers can take
    function _getDebtLimit() private view returns (uint256) {
        return (_debtRatio * _getTotalAssets()) / MAX_BPS;
    }

    /// @notice Lowers the borrower's debt he can take by specified loss and decreases his credibility
    function _decreaseBorrowerCredibility(address borrower, uint256 loss)
        private
    {
        uint256 debt = borrowersData[borrower].debt;

        // Make sure the borrower's loss is less than his entire debt
        require(debt > loss);

        // To decrease credibility of the borrower we should lower his "debtRatio"
        if (_debtRatio > 0) {
            uint256 debtRatioChange = Math.min(
                (_debtRatio * loss) / _totalDebt,
                borrowersData[borrower].debtRatio
            );
            if (debtRatioChange != 0) {
                borrowersData[borrower].debtRatio -= debtRatioChange;
                _debtRatio -= debtRatioChange;
            }
        }

        // Also, need to reduce the max amount of funds that can be taken by the borrower
        borrowersData[borrower].debt -= debt - loss;
        _totalDebt -= loss;
    }

    /// @notice See external implementation
    function _getAvailableCredit(address borrower)
        internal
        view
        returns (uint256)
    {
        // Lender is halted, no funds available for the borrower
        if (_isHalted) {
            return 0;
        }

        uint256 debtLimit = _getDebtLimit();
        uint256 totalDebt = _totalDebt;
        uint256 lenderAvailableFunds = debtLimit - totalDebt;

        // No more funds for credit
        if (lenderAvailableFunds <= 0) {
            return 0;
        }

        uint256 borrowerDebtLimit = (borrowersData[borrower].debtRatio *
            _getTotalAssets()) / MAX_BPS;
        uint256 borrowerDebt = borrowersData[borrower].debt;
        uint256 borrowerIntendedCredit = borrowerDebtLimit - borrowerDebt;

        // Borrower's debt limit has been exhausted
        if (borrowerIntendedCredit <= 0) {
            return 0;
        }

        // Borrower may not take more funds than the lender's limit
        uint256 availableCredit = Math.min(
            lenderAvailableFunds,
            borrowerIntendedCredit
        );

        // Available credit is limited by the existing number of tokens on the lender's contract
        availableCredit = Math.min(availableCredit, _getFreeAssets());

        return availableCredit;
    }

    /// @notice See external implementation
    function _getOutstandingDebt(address borrower)
        internal
        view
        returns (uint256)
    {
        uint256 borrowerDebt = borrowersData[borrower].debt;
        if (_isHalted || _debtRatio == 0) {
            return borrowerDebt;
        }

        uint256 borrowerDebtLimit = (borrowersData[borrower].debtRatio *
            _getTotalAssets()) / MAX_BPS;
        if (borrowerDebt <= borrowerDebtLimit) {
            return 0;
        }

        return borrowerDebt - borrowerDebtLimit;
    }
}
