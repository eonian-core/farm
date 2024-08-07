// SPDX-License-Identifier: GNU AGPLv3
pragma solidity ^0.8.26;

import {IERC20Upgradeable} from "@openzeppelin/contracts-upgradeable/token/ERC20/IERC20Upgradeable.sol";
import {SafeERC20Upgradeable} from "@openzeppelin/contracts-upgradeable/token/ERC20/utils/SafeERC20Upgradeable.sol";
import {IERC20Metadata} from "@openzeppelin/contracts/token/ERC20/extensions/IERC20Metadata.sol";

import {IVault} from "./IVault.sol";
import {ILender} from "./lending/ILender.sol";
import {Lender} from "./lending/Lender.sol";
import {StrategiesLender} from "./lending/StrategiesLender.sol";
import {SafeERC4626Upgradeable, ERC4626Upgradeable} from "./tokens/SafeERC4626Upgradeable.sol";
import {IERC4626} from "./tokens/IERC4626.sol";
import {IStrategy} from "./strategies/IStrategy.sol";
import {SafeInitializable} from "./upgradeable/SafeInitializable.sol";
import {SafeUUPSUpgradeable} from "./upgradeable/SafeUUPSUpgradeable.sol";
import {IVersionable} from "./upgradeable/IVersionable.sol";
import {ERC4626Lifecycle} from "./tokens/ERC4626Lifecycle.sol";
import {IVaultHook} from "./tokens/IVaultHook.sol";
import {RewardHolder} from "./tokens/RewardHolder.sol";


error ExceededMaximumFeeValue();

error InsufficientVaultBalance(uint256 assets, uint256 shares);
error InvalidLockedProfitReleaseRate(uint256 durationInSeconds);
error InappropriateStrategy();
error FoundersNotSet();
error TransferFromTriggeredNotByBorrower();

contract Vault is IVault, SafeUUPSUpgradeable, SafeERC4626Upgradeable, StrategiesLender, ERC4626Lifecycle {
    using SafeERC20Upgradeable for IERC20Upgradeable;

    /// @notice Represents the maximum value of the locked-in profit ratio scale (where 1e18 is 100%).
    uint256 public constant LOCKED_PROFIT_RELEASE_SCALE = 10**18;

    /// @notice Rewards contract where management fees are sent to.
    address public rewards;

    /// @notice Vault management fee (in BPS).
    uint256 public managementFee;

    /// @notice The amount of funds that cannot be withdrawn by users.
    ///         Decreases with time at the rate of "lockedProfitReleaseRate".
    uint256 public lockedProfitBaseline;

    /// @notice The rate of "lockedProfitBaseline" decline on the locked-in profit scale (scaled to 1e18).
    ///         Represents the amount of funds that will be unlocked when one second passes.
    uint256 public lockedProfitReleaseRate;

    /// @notice Vault Founders Token contract where rewards for founders are sent to.
    address public founders;

    /// @notice Vault founders reward (in BPS).
    uint256 public foundersFee;

    /// @dev This empty reserved space is put in place to allow future versions to add new
    ///      variables without shifting down storage in the inheritance chain.
    ///      See https://docs.openzeppelin.com/contracts/4.x/upgradeable#storage_gaps
    uint256[48] private __gap;

    /// @notice Event that should happen when the locked-in profit release rate changed.
    event LockedProfitReleaseRateChanged(uint256 rate);

    /// @notice Event that should happen when the founder token contract is set.
    event FoundersTokenSet(address oldFounders, address newFounders);

    /// @notice Event that should happen when the founder token reward fee is set.
    event FoundersTokenFeeSet(uint256 oldFee, uint256 newFee);

    /// @notice Event that should happen when the rewards address is set.
    event RewardsHolderSet(address oldHolder, address newHolder);

    /// @notice Event that should happen when the management fee is set.
    event ManagementFeeSet(uint256 oldFee, uint256 newFee);

    /// @inheritdoc IVersionable
    function version() external pure override returns (string memory) {
        return "0.2.3";
    }

    // ------------------------------------------ Constructors ------------------------------------------

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor(bool needDisableInitializers) SafeInitializable(needDisableInitializers) {} // solhint-disable-line no-empty-blocks

    function initialize(
        address _asset,
        address _rewards,
        uint256 _managementFee,
        uint256 _lockedProfitReleaseRate,
        string memory _name,
        string memory _symbol,
        address[] memory _defaultOperators,
        uint256 _foundersFee
    ) public initializer {
        __SafeUUPSUpgradeable_init(); // Ownable under the hood
        __StrategiesLender_init_lenderSpecific(); // require Ownable
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
        setFoundersFee(_foundersFee);
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

        // returns losses from strategies,
        // but we treat losses as total issue of all holders
        // so we don't decrease amount which return to user
        _withdrawFromAllStrategies(assets);
        // as a result losses will be distributed between all holders
        // we will track change in shares <-> assets ratio directly in graph

        // Revert if insufficient assets remain in the vault after withdrawal from all strategies
        if (_freeAssets() < assets) {
            revert InsufficientVaultBalance(assets, shares);
        }
    }

    /// Check that all new strategies refer to this vault and has the same underlying asset
    function _beforeStrategyRegistered(IStrategy strategy) internal view override {
        if (this != strategy.lender() || asset != strategy.asset()) {
            revert InappropriateStrategy();
        }
    }

    /// @notice Sets the vault rewards address.
    /// @param _rewards a new rewards address.
    function setRewards(address _rewards) public onlyOwner {
        // trigger before action to emit event with old value
        emit RewardsHolderSet(rewards, _rewards);

        rewards = _rewards;
    }

    /// @notice Sets the vault management fee. Both management and foundersReward fee can't exceed 100%
    /// @param _managementFee a new management fee value (in BPS).
    function setManagementFee(uint256 _managementFee) public onlyOwner {
        if (_managementFee + foundersFee > MAX_BPS) {
            revert ExceededMaximumFeeValue();
        }

        // trigger before action to emit event with old value
        emit ManagementFeeSet(managementFee, _managementFee);

        managementFee = _managementFee;
    }

    /// @notice Sets the vault founder token contract;
    /// @param _founders a new founder token contract address.
    function setFounders(address _founders) external onlyOwner {
        // trigger before action to emit event with old value
        emit FoundersTokenSet(founders, _founders);

        founders = _founders;
        addDepositHook(IVaultHook(founders));
    }

    /// @notice Sets the vault founder token reward rate. Both management and foundersReward fee can't exceed 100%
    /// @param _foundersFee a new founder token reward fee (in BPS).
    function setFoundersFee(uint256 _foundersFee) public onlyOwner {
        if (_foundersFee + managementFee > MAX_BPS) {
            revert ExceededMaximumFeeValue();
        }

        // trigger before action to emit event with old value
        emit FoundersTokenFeeSet(foundersFee, _foundersFee);

        foundersFee = _foundersFee;
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
        uint256 ratio = (block.timestamp - lastReportTimestamp) * lockedProfitReleaseRate; // solhint-disable-line not-rely-on-time

        // In case the ratio >= scale, the calculation anyway leads to zero.
        if (ratio >= LOCKED_PROFIT_RELEASE_SCALE) {
            return 0;
        }

        uint256 lockedProfitChange = (ratio * lockedProfitBaseline) / LOCKED_PROFIT_RELEASE_SCALE;

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
        if(founders == address(0)) {
            return fee;
        }
        uint256 vaultFoundersReward = (extraFreeFunds * foundersFee) / MAX_BPS;
        if (vaultFoundersReward > 0) {
            // if rewards are set, we mint the tokens to the vault and update index for Claim rewards contract
            uint256 shares = convertToShares(vaultFoundersReward);
            _mint(founders, shares, "", "", false);
            RewardHolder(founders).depositReward(shares);
        }
        return fee + vaultFoundersReward;
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
    function totalAssets() public view override(ERC4626Upgradeable, IERC4626) returns (uint256) {
        return super.fundAssets() - _lockedProfit();
    }

    /// @inheritdoc ILender
    /// @dev Explicitly overridden here to keep this function exposed via "ILender" interface.
    function paused()
        public
        view
        override(ILender, StrategiesLender)
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
        // In general, another case cannot happen, 
        // but we keep this check because transferFrom commonly abused
        if(borrower != msg.sender) {
            revert TransferFromTriggeredNotByBorrower();
        }

        asset.safeTransferFrom(msg.sender, address(this), amount);
    }

    function afterDeposit(uint256 assets, uint256 shares) internal override(ERC4626Upgradeable, ERC4626Lifecycle) {
        ERC4626Lifecycle.afterDeposit(assets, shares);
    }

    /// @notice Removes the registered hook from the lifecycle.
    /// @param hook the hook address to remove.
    function unregisterLifecycleHook(IVaultHook hook) external onlyOwner returns (bool) {
        return removeDepositHook(hook);
    }
}
