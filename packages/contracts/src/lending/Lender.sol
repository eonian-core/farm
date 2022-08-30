// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/math/Math.sol";
import "@openzeppelin/contracts-upgradeable/security/PausableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/ReentrancyGuardUpgradeable.sol";

import "./ILender.sol";

error BorrowerAlreadyExists();
error BorrowerDoesNotExist();
error BorrowerHasDebt();
error CallerIsNotABorrower();
error LenderRatioExceeded(uint256 freeRatio);
error FalsePositiveReport();

abstract contract Lender is
    ILender,
    PausableUpgradeable,
    ReentrancyGuardUpgradeable
{
    struct BorrowerData {
        /// Timestamp of the block in which the borrower was activated
        uint256 activationTimestamp;
        /// Last time a borrower made a report
        uint256 lastReportTimestamp;
        /// Amount of tokens taken by the borrower
        uint256 debt;
        /// Maximum portion of the loan that the borrower can take (in BPS)
        /// Represents credibility of the borrower
        uint256 debtRatio;
    }

    uint256 constant MAX_BPS = 10_000;

    /// @notice Amount of tokens that all borrowers have taken
    uint256 public totalDebt;

    /// @notice Debt ratio for the Lender across all borrowers (in BPS, <= 10k)
    uint256 public debtRatio;

    /// @notice Last time a report occurred by any borrower
    uint256 public lastReportTimestamp;

    /// @notice Records with information on each borrower using the lender's services
    mapping(address => BorrowerData) public borrowersData;

    /// @notice Event that must occur when the borrower reported the results of his debt management
    /// @param borrower Borrower's contract address
    /// @param debtPayment Amount of outstanding debt repaid by the borrower
    /// @param freeFunds Free funds on the borrower's contract that remain after the debt is paid
    /// @param fundsGiven Funds issued to the borrower by this lender
    /// @param fundsTaken Funds that have been taken from the borrower by the lender
    /// @param loss Amount of funds that the borrower realised as loss
    event BorrowerDebtManagementReported(
        address indexed borrower,
        uint256 debtPayment,
        uint256 freeFunds,
        uint256 fundsGiven,
        uint256 fundsTaken,
        uint256 loss
    );

    modifier onlyBorrowers() {
        if (borrowersData[msg.sender].activationTimestamp == 0) {
            revert CallerIsNotABorrower();
        }
        _;
    }

    /// @notice Updates the last report timestamp for the specified borrower and this lender.
    modifier updateLastReportTime() {
        _;
        borrowersData[msg.sender]
            .lastReportTimestamp = lastReportTimestamp = block.timestamp;
    }

    function __Lender_init() internal onlyInitializing {
        __Pausable_init();
        __ReentrancyGuard_init();

        __Lender_init_unchained();
    }

    function __Lender_init_unchained() internal onlyInitializing {
        lastReportTimestamp = block.timestamp;
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
    function currentDebt() external view override returns (uint256) {
        return currentStrategyDebt(msg.sender);
    }

    /// @inheritdoc ILender
    function isActivated() external view override returns (bool) {
        return isStrategyActivated(msg.sender);
    }

    /// @inheritdoc ILender
    function reportPositiveDebtManagement(
        uint256 extraFreeFunds,
        uint256 debtPayment
    ) external override onlyBorrowers updateLastReportTime nonReentrant {
        // Checking whether the borrower is telling the truth about his available funds
        if (_borrowerFreeAssets(msg.sender) < extraFreeFunds + debtPayment) {
            revert FalsePositiveReport();
        }

        uint256 chargedFees = 0;
        // We can only charge a fees if the borrower has reported extra free funds,
        // if it's the first report at this block and only if the borrower was registered some time ago
        if (
            extraFreeFunds > 0 &&
            borrowersData[msg.sender].lastReportTimestamp < block.timestamp &&
            borrowersData[msg.sender].activationTimestamp < block.timestamp
        ) {
            chargedFees = _chargeFees(extraFreeFunds);
        }

        _rebalanceBorrowerFunds(msg.sender, debtPayment, extraFreeFunds, 0);

        _afterPositiveDebtManagementReport(extraFreeFunds, chargedFees);
    }

    /// @inheritdoc ILender
    function reportNegativeDebtManagement(uint256 loss, uint256 debtPayment)
        external
        override
        onlyBorrowers
        updateLastReportTime
        nonReentrant
    {
        // Checking whether the borrower has available funds for debt payment
        require(_borrowerFreeAssets(msg.sender) >= debtPayment);

        // Debt wasn't repaid, we need to decrease the ratio of this borrower
        if (loss > 0) {
            _decreaseBorrowerCredibility(msg.sender, loss);
        }

        _rebalanceBorrowerFunds(msg.sender, debtPayment, 0, loss);

        _afterNegativeDebtManagementReport(loss);
    }

    /// @notice Balances the borrower's account and adjusts the current amount of funds the borrower can take.
    /// @param borrower a borrower's contract address.
    /// @param debtPayment an amount of outstanding debt since the previous report, that the borrower managed to cover. Can be zero.
    /// @param borrowerFreeFunds a funds that the borrower has earned since the previous report. Can be zero.
    /// @param loss a number of tokens by which the borrower's balance has decreased since the last report.
    function _rebalanceBorrowerFunds(
        address borrower,
        uint256 debtPayment,
        uint256 borrowerFreeFunds,
        uint256 loss
    ) private {
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
            fundsTaken,
            loss
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
    function lendingAssets() public view virtual returns (uint256) {
        return _freeAssets() + totalDebt;
    }

    /// @notice Returns the current debt that the strategy has.
    function currentStrategyDebt(address borrower)
        public
        view
        returns (uint256)
    {
        return borrowersData[borrower].debt;
    }

    /// @notice See external implementation
    function isStrategyActivated(address borrower) public view returns (bool) {
        return borrowersData[borrower].activationTimestamp > 0;
    }

    /// @notice Returns the total number of tokens borrowers can take
    function _debtLimit() private view returns (uint256) {
        return (debtRatio * lendingAssets()) / MAX_BPS;
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
            lendingAssets()) / MAX_BPS;
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
            lendingAssets()) / MAX_BPS;
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
        if (isStrategyActivated(borrower)) {
            revert BorrowerAlreadyExists();
        }

        if (debtRatio + borrowerDebtRatio > MAX_BPS) {
            revert LenderRatioExceeded(MAX_BPS - debtRatio);
        }

        borrowersData[borrower] = BorrowerData(
            block.timestamp, // Activation timestamp
            block.timestamp, // Last report timestamp
            0, // Initial debt
            borrowerDebtRatio // Debt ratio
        );

        debtRatio += borrowerDebtRatio;
    }

    /// @notice Sets the borrower's debt ratio. Will be reverted if the borrower doesn't exist or the total debt ratio is exceeded.
    /// @dev In the case where you want to disable the borrower, you need to set its ratio to 0.
    ///      Thus, the borrower's current debt becomes an outstanding debt, which he must repay to the lender.
    function _setBorrowerDebtRatio(address borrower, uint256 borrowerDebtRatio)
        internal
    {
        if (!isStrategyActivated(borrower)) {
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
        if (borrowersData[borrower].debtRatio > 0) {
            revert BorrowerHasDebt();
        }
        delete borrowersData[borrower];
    }

    /// @notice Charges a fee on the borrower's income.
    /// @param extraFreeFunds an income from which the fees will be calculated.
    /// @return The total amount of fees charged.
    function _chargeFees(uint256 extraFreeFunds)
        internal
        virtual
        returns (uint256);

    /// @notice Callback that is called at the end of the positive report function.
    /// @param extraFreeFunds the reported extra amount of borrower's funds.
    /// @param chargedFees the total amount of charged fees.
    function _afterPositiveDebtManagementReport(
        uint256 extraFreeFunds,
        uint256 chargedFees
    ) internal virtual;

    /// @notice Callback that is called at the end of the negative report function.
    /// @param loss the number of tokens by which the borrower's balance has decreased since the last report.
    function _afterNegativeDebtManagementReport(uint256 loss) internal virtual;
}
