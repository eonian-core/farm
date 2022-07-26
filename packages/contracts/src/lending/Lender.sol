// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/math/Math.sol";
import "@openzeppelin/contracts-upgradeable/security/PausableUpgradeable.sol";
import "./ILender.sol";
import "forge-std/console.sol";

error BorrowerAlreadyExists();
error BorrowerDoesNotExist();
error LenderRatioExceeded(uint256 freeRatio);
error FalsePositiveReport();

abstract contract Lender is ILender, PausableUpgradeable {
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
    uint256 public totalDebt;

    // Debt ratio for the Lender across all borrowers (in BPS, <= 10k)
    uint256 public debtRatio;

    // Records with information on each borrower using the lender's services
    mapping(address => BorrowerData) public borrowersData;

    // Event that must occur when the borrower reported the results of his debt management
    event BorrowerDebtManagementReported(
        address indexed borrower, // Borrower's contract address
        uint256 debtPayment, // Amount of outstanding debt repaid by the borrower
        uint256 freeFunds, // Free funds on the borrower's contract that remain after the debt is paid
        uint256 fundsGiven, // Funds issued to the borrower by this lender
        uint256 fundsTaken // Funds that have been taken from the borrower by the lender
    );

    modifier onlyBorrowers() {
        require(
            borrowersData[msg.sender].activationTimestamp > 0,
            "Not a borrower"
        );
        _;
    }

    function __Lender_init() internal onlyInitializing {
        __Pausable_init();
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
    function reportPositiveDebtManagement(
        uint256 extraFreeFunds,
        uint256 debtPayment
    ) external override onlyBorrowers {
        // Checking whether the borrower is telling the truth about his available funds
        if (_borrowerFreeAssets(msg.sender) < extraFreeFunds + debtPayment) {
            revert FalsePositiveReport();
        }

        // TODO: Assess n' pay management fees here

        _rebalanceBorrowerFunds(msg.sender, debtPayment, extraFreeFunds);
    }

    /// @inheritdoc ILender
    function reportNegativeDebtManagement(
        uint256 remainingDebt,
        uint256 debtPayment
    ) external override onlyBorrowers {
        // Checking whether the borrower has available funds for debt payment
        require(_borrowerFreeAssets(msg.sender) >= debtPayment);

        if (remainingDebt > 0) {
            _decreaseBorrowerCredibility(msg.sender, remainingDebt);
        }

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

        // Make sure that the borrower's debt payment doesn't exceed his actual outstanding debt
        uint256 borrowerOutstandingDebt = _outstandingDebt(msg.sender);
        debtPayment = Math.min(debtPayment, borrowerOutstandingDebt);

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
        uint256 fundsGiven = 0;
        uint256 fundsTaken = 0;
        if (freeBorrowerBalance < borrowerAvailableCredit) {
            fundsGiven = borrowerAvailableCredit - freeBorrowerBalance;
            _transferFundsToBorrower(borrower, fundsGiven);
        } else if (freeBorrowerBalance > borrowerAvailableCredit) {
            fundsTaken = freeBorrowerBalance - borrowerAvailableCredit;
            _takeFundsFromBorrower(borrower, fundsTaken);
        }

        emit BorrowerDebtManagementReported(
            borrower,
            debtPayment,
            borrowerFreeFunds,
            fundsGiven,
            fundsTaken
        );
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
    function totalAssets() public view virtual returns (uint256) {
        return _freeAssets() + totalDebt;
    }

    /// @notice Returns the total number of tokens borrowers can take
    function _debtLimit() private view returns (uint256) {
        return (debtRatio * totalAssets()) / MAX_BPS;
    }

    /// @notice Lowers the borrower's debt he can take by specified loss and decreases his credibility
    /// @dev This function has "internal" visibility because it's used in tests
    function _decreaseBorrowerCredibility(address borrower, uint256 loss)
        internal
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
            totalAssets()) / MAX_BPS;
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
            totalAssets()) / MAX_BPS;
        if (borrowerDebt <= borrowerDebtLimit) {
            return 0;
        }

        return borrowerDebt - borrowerDebtLimit;
    }

    /// @notice Registers a new borrower and sets for him a certain debt ratio
    function _registerBorrower(address borrower, uint256 borrowerDebtRatio)
        internal
    {
        // Check if specified borrower has already registered
        if (borrowersData[borrower].activationTimestamp > 0) {
            revert BorrowerAlreadyExists();
        }

        if (debtRatio + borrowerDebtRatio > MAX_BPS) {
            revert LenderRatioExceeded(MAX_BPS - debtRatio);
        }

        borrowersData[borrower] = BorrowerData(
            block.timestamp,
            0,
            borrowerDebtRatio
        );

        debtRatio += borrowerDebtRatio;
    }

    /// @notice Sets the borrower's debt ratio. Will be reverted if the borrower doesn't exist or the total debt ratio is exceeded.
    /// @dev In the case where you want to disable the borrower, you need to set its ratio to 0.
    ///      Thus, the borrower's current debt becomes an outstanding debt, which he must repay to the lender.
    function _setBorrowerDebtRatio(address borrower, uint256 borrowerDebtRatio)
        internal
    {
        if (borrowersData[borrower].activationTimestamp == 0) {
            revert BorrowerDoesNotExist();
        }

        debtRatio -= borrowersData[borrower].debtRatio;
        borrowersData[borrower].debtRatio = borrowerDebtRatio;
        debtRatio += borrowerDebtRatio;

        if (debtRatio > MAX_BPS) {
            revert LenderRatioExceeded(
                MAX_BPS - (debtRatio - borrowerDebtRatio)
            );
        }
    }

    /// @notice Deletes the borrower from the list
    /// @dev Should be called after the borrower's debt ratio is changed to 0, because the lender must take back all the released funds.
    function _unregisterBorrower(address borrower) internal {
        require(
            borrowersData[borrower].debtRatio == 0,
            "Borrower still has a debt"
        );

        delete borrowersData[borrower];
    }
}
