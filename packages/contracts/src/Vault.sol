// SPDX-License-Identifier: AGPL-3.0-or-later
pragma solidity ^0.8.19;

import {MathUpgradeable} from "@openzeppelin/contracts-upgradeable/utils/math/MathUpgradeable.sol";
import {SafeERC20Upgradeable, IERC20Upgradeable} from "@openzeppelin/contracts-upgradeable/token/ERC20/utils/SafeERC20Upgradeable.sol";
import {OwnableUpgradeable} from "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import {IERC20Metadata} from "@openzeppelin/contracts/token/ERC20/extensions/IERC20Metadata.sol";
import {PausableUpgradeable} from "@openzeppelin/contracts-upgradeable/security/PausableUpgradeable.sol";

import {IVault} from "./IVault.sol";
import {Lender, BorrowerDoesNotExist} from "./lending/Lender.sol";
import {SafeERC4626Upgradeable, ERC4626Upgradeable} from "./tokens/SafeERC4626Upgradeable.sol";
import {IStrategy} from "./strategies/IStrategy.sol";
import {AddressList} from "./structures/AddressList.sol";

error ExceededMaximumFeeValue();
error UnexpectedZeroAddress();
error InappropriateStrategy();
error StrategyNotFound();
error StrategyAlreadyExists();
error InsufficientVaultBalance(uint256 assets, uint256 shares);
error WrongQueueSize(uint256 size);
error InvalidLockedProfitReleaseRate(uint256 durationInSeconds);
error AccessDeniedForCaller(address caller);

contract Vault is IVault, OwnableUpgradeable, SafeERC4626Upgradeable, Lender {
    using SafeERC20Upgradeable for IERC20Upgradeable;
    using AddressList for address[];

    /// @notice Represents the maximum value of the locked-in profit ratio scale (where 1e18 is 100%).
    uint256 constant LOCKED_PROFIT_RELEASE_SCALE = 10**18;

    /// @notice Rewards contract where management fees are sent to.
    address public rewards;

    /// @notice Vault management fee (in BPS).
    uint256 public managementFee;

    /// @notice Arranged list of addresses of strategies, which defines the order for withdrawal.
    address[] public withdrawalQueue;

    /// @notice The amount of funds that cannot be withdrawn by users.
    ///         Decreases with time at the rate of "lockedProfitReleaseRate".
    uint256 public lockedProfitBaseline;

    /// @notice The rate of "lockedProfitBaseline" decline on the locked-in profit scale (scaled to 1e18).
    ///         Represents the amount of funds that will be unlocked when one second passes.
    uint256 public lockedProfitReleaseRate;

    /// @notice Event that should happen when the strategy connects to the vault.
    /// @param strategy Address of the strategy contract.
    /// @param debtRatio Maximum portion of the loan that the strategy can take (in BPS).
    event StrategyAdded(address indexed strategy, uint256 debtRatio);

    /// @notice Event that should happen when the strategy has been revoked from the vault.
    /// @param strategy Address of the strategy contract.
    event StrategyRevoked(address indexed strategy);

    /// @notice Event that should happen when the strategy has been removed from the vault.
    /// @param strategy Address of the strategy contract.
    /// @param fromQueueOnly If "true", then the strategy has only been removed from the withdrawal queue.
    event StrategyRemoved(address indexed strategy, bool fromQueueOnly);

    /// @notice Event that should happen when the strategy has been returned to the withdrawal queue.
    /// @param strategy Address of the strategy contract.
    event StrategyReturnedToQueue(address indexed strategy);

    /// @notice Event that should happen when the locked-in profit release rate changed.
    event LockedProfitReleaseRateChanged(uint256 rate);

    /// @dev This empty reserved space is put in place to allow future versions to add new
    ///      variables without shifting down storage in the inheritance chain.
    ///      See https://docs.openzeppelin.com/contracts/4.x/upgradeable#storage_gaps
    uint256[50] private __gap;

    modifier onlyOwnerOrStrategy(address strategy) {
        if (msg.sender != owner() && msg.sender != strategy) {
            revert AccessDeniedForCaller(msg.sender);
        }
        _;
    }

    function initialize(
        address _asset,
        address _rewards,
        uint256 _managementFee,
        uint256 _lockedProfitReleaseRate,
        string memory _name,
        string memory _symbol,
        address[] memory _defaultOperators
    ) public initializer {
        __Ownable_init();
        __Lender_init();
        __SafeERC4626_init(
            IERC20Upgradeable(_asset),
            bytes(_name).length == 0
                ? string.concat(
                    IERC20Metadata(_asset).symbol(),
                    " Eonian Vault Shares"
                )
                : _name,
            bytes(_symbol).length == 0
                ? string.concat("eon", IERC20Metadata(_asset).symbol())
                : _symbol,
            _defaultOperators
        );

        setRewards(_rewards);
        setManagementFee(_managementFee);
        setLockedProfitReleaseRate(_lockedProfitReleaseRate);
    }

    /// @inheritdoc IVault
    function version() external pure override returns (string memory) {
        return "1.0.0";
    }

    /// @dev Override to add the "whenNotPaused" modifier
    /// @inheritdoc SafeERC4626Upgradeable
    function deposit(uint256 assets)
        public
        override
        whenNotPaused
        returns (uint256 shares)
    {
        return super.deposit(assets);
    }

    /// @notice Hook that is used before withdrawals to release assets from strategies if necessary.
    /// @inheritdoc ERC4626Upgradeable
    function beforeWithdraw(uint256 assets, uint256 shares) internal override {
        // There is no need to withdraw assets from strategies, the vault has sufficient funds
        if (_freeAssets() >= assets) {
            return;
        }

        for (uint256 i = 0; i < withdrawalQueue.length; i++) {
            // If the vault already has the required amount of funds, we need to finish the withdrawal
            uint256 vaultBalance = _freeAssets();
            if (assets <= vaultBalance) {
                break;
            }

            address strategy = withdrawalQueue[i];

            // We can only withdraw the amount that the strategy has as debt,
            // so that the strategy can work on the unreported (yet) funds it has earned
            uint256 requiredAmount = MathUpgradeable.min(
                assets - vaultBalance,
                borrowersData[strategy].debt
            );

            // Skip this strategy is there is nothing to withdraw
            if (requiredAmount == 0) {
                continue;
            }

            // Withdraw the required amount of funds from the strategy
            uint256 loss = IStrategy(strategy).withdraw(requiredAmount);

            // If the strategy failed to return all of the requested funds, we need to reduce the strategy's debt ratio
            if (loss > 0) {
                _decreaseBorrowerCredibility(strategy, loss);
            }
        }

        // Revert if insufficient assets remain in the vault after withdrawal from all strategies
        if (_freeAssets() < assets) {
            revert InsufficientVaultBalance(assets, shares);
        }
    }

    /// @notice Adds a new strategy to the vault.
    /// @param strategy a new strategy address.
    /// @param debtRatio a ratio that shows how much of the new strategy can take, relative to other strategies.
    function addStrategy(address strategy, uint256 debtRatio)
        external
        onlyOwner
        whenNotPaused
    {
        if (strategy == address(0)) {
            revert UnexpectedZeroAddress();
        }

        // Strategy should refer to this vault and has the same underlying asset
        if (
            this != IStrategy(strategy).vault() ||
            asset != IStrategy(strategy).asset()
        ) {
            revert InappropriateStrategy();
        }

        _registerBorrower(strategy, debtRatio);
        withdrawalQueue.add(strategy);

        emit StrategyAdded(strategy, debtRatio);
    }

    /// @notice Adds a strategy to the withdrawal queue. The strategy must already be registered as a borrower.
    /// @param strategy a strategy address.
    function addStrategyToQueue(address strategy) external onlyOwner {
        if (strategy == address(0)) {
            revert UnexpectedZeroAddress();
        }

        if (withdrawalQueue.contains(strategy)) {
            revert StrategyAlreadyExists();
        }

        if (borrowersData[strategy].activationTimestamp == 0) {
            revert BorrowerDoesNotExist();
        }

        withdrawalQueue.add(strategy);

        emit StrategyReturnedToQueue(strategy);
    }

    /// @inheritdoc IVault
    function revokeStrategy(address strategy)
        external
        onlyOwnerOrStrategy(strategy)
    {
        _setBorrowerDebtRatio(strategy, 0);
        emit StrategyRevoked(strategy);
    }

    /// @notice Removes a strategy from the vault.
    /// @param strategy a strategy to remove.
    /// @param fromQueueOnly if "true", then the strategy will only be removed from the withdrawal queue.
    function removeStrategy(address strategy, bool fromQueueOnly)
        external
        onlyOwner
    {
        bool removedFromQueue = withdrawalQueue.remove(strategy);
        if (!removedFromQueue) {
            revert StrategyNotFound();
        }

        if (!fromQueueOnly) {
            _unregisterBorrower(strategy);
        }

        emit StrategyRemoved(strategy, fromQueueOnly);
    }

    /// @notice Sets the withdrawal queue.
    /// @param queue a new queue that will replace the existing one.
    ///        Should contain only those elements that already present in the existing queue.
    function reorderWithdrawalQueue(address[] memory queue) external onlyOwner {
        withdrawalQueue = withdrawalQueue.reorder(queue);
    }

    /// @notice Sets the vault rewards address.
    /// @param _rewards a new rewards address.
    function setRewards(address _rewards) public onlyOwner {
        rewards = _rewards;
    }

    /// @notice Sets the vault management fee.
    /// @param _managementFee a new management fee value (in BPS).
    function setManagementFee(uint256 _managementFee) public onlyOwner {
        if (_managementFee > MAX_BPS) {
            revert ExceededMaximumFeeValue();
        }

        managementFee = _managementFee;
    }

    /// @notice Switches the vault pause state.
    /// @param shutdown a new vault pause state. If "true" is passed, the vault will be paused.
    function setEmergencyShutdown(bool shutdown) external onlyOwner {
        shutdown ? _pause() : _unpause();
    }

    /// @notice Changes the rate of release of locked-in profit.
    /// @param rate the rate of release of locked profit (percent per second scaled to 1e18).
    ///             The desire value of this parameter can be calculated as 1e18 / DurationInSeconds.
    function setLockedProfitReleaseRate(uint256 rate) public onlyOwner {
        if (rate > LOCKED_PROFIT_RELEASE_SCALE) {
            revert InvalidLockedProfitReleaseRate(rate);
        }

        lockedProfitReleaseRate = rate;
        emit LockedProfitReleaseRateChanged(rate);
    }

    /// @notice Calculates the locked profit, takes into account the change since the last report.
    function _lockedProfit() internal view returns (uint256) {
        // Release rate should be small, since the timestamp can be manipulated by the node operator,
        // not expected to have much impact, since the changes will be applied to all users and cannot be abused directly.
        uint256 ratio = (block.timestamp - lastReportTimestamp) *
            lockedProfitReleaseRate;

        // In case the ratio >= scale, the calculation anyway leads to zero.
        if (ratio >= LOCKED_PROFIT_RELEASE_SCALE) {
            return 0;
        }

        uint256 lockedProfitChange = (ratio * lockedProfitBaseline) /
            LOCKED_PROFIT_RELEASE_SCALE;

        // Reducing locked profits over time frees up profits for users
        return lockedProfitBaseline - lockedProfitChange;
    }

    /// @inheritdoc Lender
    function _chargeFees(uint256 extraFreeFunds)
        internal
        override
        returns (uint256)
    {
        uint256 fee = (extraFreeFunds * managementFee) / MAX_BPS;
        if (fee > 0) {
            _mint(rewards, convertToShares(fee), "", "", false);
        }

        return fee;
    }

    /// @notice Updates the locked-in profit value according to the positive debt management report of the strategy
    /// @inheritdoc Lender
    function _afterPositiveDebtManagementReport(
        uint256 extraFreeFunds,
        uint256 chargedFees
    ) internal override {
        // Locking every reported strategy profit, taking into account the charged fees.
        lockedProfitBaseline = _lockedProfit() + extraFreeFunds - chargedFees;
    }

    /// @notice Updates the locked-in profit value according to the negative debt management report of the strategy
    /// @inheritdoc Lender
    function _afterNegativeDebtManagementReport(uint256 loss)
        internal
        override
    {
        uint256 currentLockedProfit = _lockedProfit();

        // If a loss occurs, it is necessary to release the appropriate amount of funds that users were able to withdraw it.
        lockedProfitBaseline = currentLockedProfit > loss
            ? currentLockedProfit - loss
            : 0;
    }

    /// @notice Returns the current debt of the strategy.
    /// @param strategy the strategy address.
    function strategyDebt(address strategy) external view returns (uint256) {
        return borrowersData[strategy].debt;
    }

    /// @notice Returns the debt ratio of the strategy.
    /// @param strategy the strategy address.
    function strategyRatio(address strategy) external view returns (uint256) {
        return borrowersData[strategy].debtRatio;
    }

    /// @notice Returns the size of the withdrawal queue.
    function getQueueSize() external view returns (uint256) {
        return withdrawalQueue.length;
    }

    /// @inheritdoc Lender
    function _freeAssets() internal view override returns (uint256) {
        return asset.balanceOf(address(this));
    }

    /// @inheritdoc Lender
    function _borrowerFreeAssets(address borrower)
        internal
        view
        override
        returns (uint256)
    {
        return asset.balanceOf(borrower);
    }

    /// @inheritdoc ERC4626Upgradeable
    function totalAssets() public view override returns (uint256) {
        return super.lendingAssets() - _lockedProfit();
    }

    /// @inheritdoc IVault
    /// @dev Explicitly overridden here to keep this function exposed via "IVault" interface.
    function paused()
        public
        view
        override(IVault, PausableUpgradeable)
        returns (bool)
    {
        return super.paused();
    }

    /// @inheritdoc Lender
    function _transferFundsToBorrower(address borrower, uint256 amount)
        internal
        override
    {
        asset.safeTransfer(borrower, amount);
    }

    /// @inheritdoc Lender
    function _takeFundsFromBorrower(address borrower, uint256 amount)
        internal
        override
    {
        asset.safeTransferFrom(borrower, address(this), amount);
    }
}
