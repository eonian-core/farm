// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/math/Math.sol";
import "@openzeppelin/contracts/security/Pausable.sol";

import "../interfaces/ILender.sol";

abstract contract Lender is ILender, Pausable {
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
    uint256 public totalDebt = 0;

    // Debt ratio for the Lender across all borrowers (in BPS, <= 10k)
    uint256 public debtRatio = 0;

    // Records with information on each borrower using the lender's services
    mapping(address => BorrowerData) public borrowersData;

    modifier onlyBorrowers() {
        require(
            borrowersData[msg.sender].activationTimestamp > 0,
            "Not a borrower"
        );
        _;
    }

    /// @inheritdoc ILender
    function availableCredit() external view override returns (uint256) {
        return _availableCredit(msg.sender);
    }

    /// @inheritdoc ILender
    function outstandingDebt() external view override returns (uint256) {
        return _outstandingDebt(msg.sender);
    }

    /// @inheritdoc ILender
    function reportPositiveDebtManagement(uint256 extraFreeFunds)
        external
        override
        onlyBorrowers
    {
        // If the borrower calls this function, it can be assumed that the entire outstanding debt will be repaid
        uint256 debtPayment = _outstandingDebt(msg.sender);

        // Checking whether the borrower is telling the truth about his available funds
        require(
            _borrowerFreeAssets(msg.sender) >= extraFreeFunds + debtPayment
        );

        // TODO: Assess n' pay management fees here

        _rebalanceBorrowerFunds(msg.sender, debtPayment, extraFreeFunds);
    }

    /// @inheritdoc ILender
    function reportNegativeDebtManagement(uint256 remainingDebt)
        external
        override
        onlyBorrowers
    {
        uint256 borrowerOutstandingDebt = _outstandingDebt(msg.sender);

        // Reported "remaining" debt may be greater than outstanding debt if the borrower incurs losses that he cannot cover
        uint256 debtPayment = remainingDebt <= borrowerOutstandingDebt
            ? borrowerOutstandingDebt - remainingDebt
            : 0;

        // Checking whether the borrower has available funds for debt payment
        require(_borrowerFreeAssets(msg.sender) >= debtPayment);

        if (remainingDebt > 0) {
            _decreaseBorrowerCredibility(msg.sender, remainingDebt);
        }

        // Recalculate the outstanding debt after the ratio is reduced
        // TODO: [Compare gas consumption] Return ratio delta from "_decreaseBorrowerCredibility" and multiple by declared "outstandingDebt"
        borrowerOutstandingDebt = _outstandingDebt(msg.sender);
        debtPayment = Math.min(debtPayment, borrowerOutstandingDebt);

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
        uint256 borrowerAvailableCredit = _availableCredit(borrower);

        // Take into account repaid debt, if any
        if (debtPayment > 0) {
            borrowersData[borrower].debt -= debtPayment;
            totalDebt -= debtPayment;
        }

        // Allocate some funds to the borrower if possible
        if (borrowerAvailableCredit > 0) {
            borrowersData[borrower].debt += borrowerAvailableCredit;
            totalDebt += borrowerAvailableCredit;
        }

        // Now we need to compare the allocated funds to the borrower and his current free balance.
        // If the number of unrealized tokens on the borrower's contract is less than the available credit, the lender must give that difference to the borrower.
        // Otherwise (if the amount of the borrower's available funds is greater than he should have according to his share), the lender must take that portion of the funds for himself.
        uint256 freeBorrowerBalance = borrowerFreeFunds + debtPayment;
        if (freeBorrowerBalance < borrowerAvailableCredit) {
            _transferFundsToBorrower(
                borrower,
                borrowerAvailableCredit - freeBorrowerBalance
            );
        } else if (freeBorrowerBalance > borrowerAvailableCredit) {
            _takeFundsFromBorrower(
                borrower,
                freeBorrowerBalance - borrowerAvailableCredit
            );
        }
    }

    /// @notice Returns the unrealized amount of the lender's tokens (lender's contract balance)
    function _freeAssets() internal view virtual returns (uint256);

    /// @notice Returns the unrealized amount of the borrower's tokens (contract balance of the specified borrower)
    function _borrowerFreeAssets(address borrower)
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
    function _totalAssets() internal view returns (uint256) {
        return _freeAssets() + totalDebt;
    }

    /// @notice Returns the total number of tokens borrowers can take
    function _debtLimit() private view returns (uint256) {
        return (debtRatio * _totalAssets()) / MAX_BPS;
    }

    /// @notice Lowers the borrower's debt he can take by specified loss and decreases his credibility
    function _decreaseBorrowerCredibility(address borrower, uint256 loss)
        private
    {
        uint256 debt = borrowersData[borrower].debt;

        // Make sure the borrower's loss is less than his entire debt
        require(debt >= loss);

        // To decrease credibility of the borrower we should lower his "debtRatio"
        if (debtRatio > 0) {
            uint256 debtRatioChange = Math.min(
                (debtRatio * loss) / totalDebt,
                borrowersData[borrower].debtRatio
            );
            if (debtRatioChange != 0) {
                borrowersData[borrower].debtRatio -= debtRatioChange;
                debtRatio -= debtRatioChange;
            }
        }

        // Also, need to reduce the max amount of funds that can be taken by the borrower
        borrowersData[borrower].debt -= loss;
        totalDebt -= loss;
    }

    /// @notice See external implementation
    function _availableCredit(address borrower)
        internal
        view
        returns (uint256)
    {
        // Lender is paused, no funds available for the borrower
        if (paused()) {
            return 0;
        }

        uint256 lenderDebtLimit = _debtLimit();
        uint256 lenderDebt = totalDebt;
        uint256 borrowerDebtLimit = (borrowersData[borrower].debtRatio *
            _totalAssets()) / MAX_BPS;
        uint256 borrowerDebt = borrowersData[borrower].debt;

        // There're no more funds for the borrower because he has outstanding debt or the lender's available funds have been exhausted
        if (
            lenderDebtLimit <= lenderDebt || borrowerDebtLimit <= borrowerDebt
        ) {
            return 0;
        }

        uint256 lenderAvailableFunds = lenderDebtLimit - lenderDebt;
        uint256 borrowerIntendedCredit = borrowerDebtLimit - borrowerDebt;

        // Borrower may not take more funds than the lender's limit
        uint256 borrowerAvailableCredit = Math.min(
            lenderAvailableFunds,
            borrowerIntendedCredit
        );

        // Available credit is limited by the existing number of tokens on the lender's contract
        borrowerAvailableCredit = Math.min(
            borrowerAvailableCredit,
            _freeAssets()
        );

        return borrowerAvailableCredit;
    }

    /// @notice See external implementation
    function _outstandingDebt(address borrower)
        internal
        view
        returns (uint256)
    {
        uint256 borrowerDebt = borrowersData[borrower].debt;
        if (paused() || debtRatio == 0) {
            return borrowerDebt;
        }

        uint256 borrowerDebtLimit = (borrowersData[borrower].debtRatio *
            _totalAssets()) / MAX_BPS;
        if (borrowerDebt <= borrowerDebtLimit) {
            return 0;
        }

        return borrowerDebt - borrowerDebtLimit;
    }
}
