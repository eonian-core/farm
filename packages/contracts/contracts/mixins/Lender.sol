// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/math/Math.sol";

import "../interfaces/ILender.sol";

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

    /// @notice Reports a positive result of the borrower's debt management.
    ///         Borrower must call this function if he has made any profit
    ///         or/and has a free funds available to repay the outstanding debt (if any).
    /// @param extraFreeFunds an extra amount of free funds borrower's contract has.
    ///                       This reporting amount must be greater than the borrower's outstanding debt.
    function reportPositiveDebtMaintainingResult(uint256 extraFreeFunds)
        external
        override
        onlyBorrowers
    {
        // If the borrower calls this function, it can be assumed that the entire outstanding debt will be repaid
        uint256 debtPayment = _getOutstandingDebt(msg.sender);

        // Checking whether the borrower is telling the truth about his available funds
        require(
            _getBorrowerFreeAssets(msg.sender) >= extraFreeFunds + debtPayment
        );

        // TODO: Assess n' pay management fees here

        _rebalanceBorrowerFunds(msg.sender, debtPayment, extraFreeFunds);
    }

    /// @notice Reports a negative result of the borrower's debt management.
    ///         The borrower must call this function if he is unable to cover his outstanding debt or if he has incurred any losses.
    /// @param remainingDebt a number of tokens by which the borrower's balance has decreased since the last report.
    ///                      May include a portion of the outstanding debt that the borrower was unable to repay.
    function reportNegativeDebtMaintainingResult(uint256 remainingDebt)
        external
        override
        onlyBorrowers
    {
        uint256 outstandingDebt = _getOutstandingDebt(msg.sender);

        // Reported "remaining" debt may be greater than outstanding debt if the borrower incurs losses that he cannot cover
        uint256 debtPayment = remainingDebt <= outstandingDebt
            ? outstandingDebt - remainingDebt
            : 0;

        // Checking whether the borrower has available funds for debt payment
        require(_getBorrowerFreeAssets(msg.sender) >= debtPayment);

        if (remainingDebt > 0) {
            _decreaseBorrowerCredibility(msg.sender, remainingDebt);
        }

        // Recalculate the outstanding debt after the ratio is reduced
        // TODO: [Compare gas consumption] Return ratio delta from "_decreaseBorrowerCredibility" and multiple by declared "outstandingDebt"
        outstandingDebt = _getOutstandingDebt(msg.sender);
        debtPayment = Math.min(debtPayment, outstandingDebt);

        _rebalanceBorrowerFunds(msg.sender, debtPayment, 0);
    }

    /// @notice Balances the borrower's account and adjusts the current amount of funds the borrower can take.
    /// @param borrower a borrower's contract address
    /// @param debtPayment an amount of outstanding debt since the previous report, that the borrower managed to cover. Can be zero.
    /// @param borrowerFreeFunds a funds that the borrower has earned since the previous report. Can be zero.
    function _rebalanceBorrowerFunds(
        address borrower,
        uint256 debtPayment,
        uint256 borrowerFreeFunds
    ) internal {
        // Calculate the amount of credit the lender can provide to the borrower (if any)
        uint256 availableCredit = _getAvailableCredit(borrower);

        // Take into account repaid debt, if any
        if (debtPayment > 0) {
            borrowersData[borrower].debt -= debtPayment;
            _totalDebt -= debtPayment;
        }

        // Allocate some funds to the borrower if possible
        if (availableCredit > 0) {
            borrowersData[borrower].debt += availableCredit;
            _totalDebt += availableCredit;
        }

        // Now we need to compare the allocated funds to the borrower and his current free balance.
        // If the number of unrealized tokens on the borrower's contract is less than the available credit, the lender must give that difference to the borrower.
        // Otherwise (if the amount of the borrower's available funds is greater than he should have according to his share), the lender must take that portion of the funds for himself.
        uint256 freeBorrowerBalance = borrowerFreeFunds + debtPayment;
        if (freeBorrowerBalance < availableCredit) {
            _transferFundsToBorrower(
                borrower,
                availableCredit - freeBorrowerBalance
            );
        } else if (freeBorrowerBalance > availableCredit) {
            _takeFundsFromBorrower(
                borrower,
                freeBorrowerBalance - availableCredit
            );
        }
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
