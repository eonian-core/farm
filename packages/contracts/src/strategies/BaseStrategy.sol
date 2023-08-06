// SPDX-License-Identifier: AGPL-3.0
pragma solidity ^0.8.19;

import {AggregatorV3Interface} from "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";
import {PausableUpgradeable} from "@openzeppelin/contracts-upgradeable/security/PausableUpgradeable.sol";
import {IERC20Upgradeable} from "@openzeppelin/contracts-upgradeable/token/ERC20/IERC20Upgradeable.sol";
import {IERC20MetadataUpgradeable} from "@openzeppelin/contracts-upgradeable/token/ERC20/extensions/IERC20MetadataUpgradeable.sol";
import {SafeERC20Upgradeable} from "@openzeppelin/contracts-upgradeable/token/ERC20/utils/SafeERC20Upgradeable.sol";

import {IStrategy} from "./IStrategy.sol";
import {IStrategiesLender} from "../lending/IStrategiesLender.sol";
import {GelatoJobAdapter, IOps} from "../automation/GelatoJobAdapter.sol";
import {Job} from "../automation/Job.sol";
import {HealthChecker} from "../healthcheck/HealthChecker.sol";
import {PriceConverter} from "../structures/PriceConverter.sol";

import {SafeInitializable} from "../upgradeable/SafeInitializable.sol";

error CallerIsNotALender();
error IncompatiblePriceFeeds();

abstract contract BaseStrategy is
    IStrategy,
    SafeInitializable,
    GelatoJobAdapter,
    HealthChecker,
    PausableUpgradeable
{
    using SafeERC20Upgradeable for IERC20Upgradeable;
    using PriceConverter for AggregatorV3Interface;

    IStrategiesLender public lender;
    IERC20Upgradeable public asset;

    /// @notice Use this to adjust the threshold at which running a debt causes a work trigger.
    uint256 public debtThreshold;

    /// @notice The estimated amount of gas required for the "work" execution.
    uint256 public estimatedWorkGas;

    /// @notice Shows how many times the gas price spent for the "work" function should be lower than the profit to trigger.
    uint256 public profitFactor;

    /// @notice The USD price feed for the native token of the network on which this strategy works.
    AggregatorV3Interface internal _nativeTokenPriceFeed;

    /// @notice The USD price feed for the strategy asset.
    AggregatorV3Interface internal _assetPriceFeed;

    /// @notice The underlying asset's decimals.
    uint256 internal _assetDecimals;

    /**
     * @dev This empty reserved space is put in place to allow future versions to add new
     * variables without shifting down storage in the inheritance chain.
     * See https://docs.openzeppelin.com/contracts/4.x/upgradeable#storage_gaps
     */
    uint256[50] private __gap;

    event Harvested(
        uint256 profit,
        uint256 loss,
        uint256 debtPayment,
        uint256 outstandingDebt
    );

    event DebtThresholdUpdated(uint256 debtThreshold);

    event EstimatedWorkGasUpdated(uint256 estimatedWorkGas);

    event UpdatedProfitFactor(uint256 profitFactor);

    modifier onlyLender() {
        if (msg.sender != address(lender)) {
            revert CallerIsNotALender();
        }
        _;
    }

    // ------------------------------------------ Constructors ------------------------------------------

    function __BaseStrategy_init(
        IStrategiesLender _lender,
        IERC20Upgradeable _asset,
        IOps _ops,
        uint256 _minReportInterval,
        bool _isPrepaid,
        AggregatorV3Interface __nativeTokenPriceFeed,
        AggregatorV3Interface __assetPriceFeed,
        address _healthCheck
    ) internal onlyInitializing {
        __HealthChecker_init(_healthCheck); // ownable under the hood
        __Pausable_init();
        __GelatoJobAdapter_init(_ops, _minReportInterval, _isPrepaid);

        __BaseStrategy_init_unchained(
            _lender,
            _asset,
            __nativeTokenPriceFeed,
            __assetPriceFeed
        );
    }

    function __BaseStrategy_init_unchained(
        IStrategiesLender _lender,
        IERC20Upgradeable _asset,
        AggregatorV3Interface __nativeTokenPriceFeed,
        AggregatorV3Interface __assetPriceFeed
    ) internal onlyInitializing {
        lender = _lender;
        asset = _asset;

        debtThreshold = 0;
        estimatedWorkGas = 0;
        profitFactor = 100;

        _nativeTokenPriceFeed = __nativeTokenPriceFeed;
        _assetPriceFeed = __assetPriceFeed;
        if (_nativeTokenPriceFeed.decimals() != _assetPriceFeed.decimals()) {
            revert IncompatiblePriceFeeds();
        }

        _assetDecimals = IERC20MetadataUpgradeable(address(asset)).decimals();

        approveTokenMax(address(asset), address(_lender));
    }

    /// @notice Harvests the strategy, recognizing any profits or losses and adjusting the strategy's investments.
    /// @inheritdoc Job
    function _work() internal override {
        uint256 profit = 0;
        uint256 loss = 0;
        uint256 debtPayment = 0;

        uint256 outstandingDebt = lender.outstandingDebt();
        if (paused()) {
            (profit, loss, debtPayment) = _harvestAfterShutdown(
                outstandingDebt
            );
        } else {
            (profit, loss, debtPayment) = _harvest(outstandingDebt);
        }

        if (profit > 0) {
            lender.reportPositiveDebtManagement(profit, debtPayment);
        } else {
            lender.reportNegativeDebtManagement(loss, debtPayment);
        }

        // If the strategy needs to repay the entire debt, we need to take all available funds.
        // We will take the current debt in the report above, but we still need to free up whatever is left.
        // This can happen, if the ratio is reduced to 0 or if the vault has been shutted down.
        outstandingDebt = lender.outstandingDebt();
        outstandingDebt = lender.currentDebtRatio() == 0 || lender.paused()
            ? estimatedTotalAssets()
            : outstandingDebt;

        _adjustPosition(outstandingDebt);

        uint256 totalDebt = lender.currentDebt();
        uint256 gasCost = _gasCost();
        performHealthCheck(
            address(this),
            profit,
            loss,
            debtPayment,
            outstandingDebt,
            totalDebt,
            gasCost
        );

        emit Harvested(profit, loss, debtPayment, outstandingDebt);
    }

    /// @inheritdoc Job
    function _canWork() internal view override returns (bool) {
        if (!lender.isActivated()) {
            return false;
        }

        // Trigger this job if the strategy has the outstanding debt to repay
        uint256 outstanding = lender.outstandingDebt();
        if (outstanding > debtThreshold) {
            return true;
        }

        // Trigger this job if the strategy has some loss to report
        uint256 total = estimatedTotalAssets();
        uint256 debt = lender.currentDebt();
        if (total + debtThreshold < debt) {
            return true;
        }

        // Estimate accumulated profit
        uint256 profit = 0;
        if (total > debt) {
            profit = total - debt;
        }

        // Check the gas cost againts the profit and available credit.
        // There is no sense to call the "work" function, if we don't have decent amount of funds to move.
        return _checkGasPriceAgainstProfit(profit);
    }

    /// @notice Calculates the gas price of this transaction and compares it againts the specified profit.
    /// @param profit Profit to be compared to the cost of gas.
    /// @return "true" if the gas price (mult. to "profitFactor" is lower than the strategy profit, in USD).
    function _checkGasPriceAgainstProfit(uint256 profit) internal view returns (bool) {
        uint256 credit = lender.availableCredit();
        uint256 gasCost = _gasCost();
        return profitFactor * gasCost < _convertAmountToUSD(credit + profit);
    }

    /// @notice Calculates the gas cost for this transaction based on gas price and work
    /// @return gas price
    function _gasCost() internal view returns  (uint256) {
        return _gasPriceUSD() * estimatedWorkGas;
    }

    /// @inheritdoc IStrategy
    function withdraw(uint256 assets) external override onlyLender returns (uint256 loss) { // Vault already have nonReentrant modifier check
        // Liquidate the requested amount of tokens
        uint256 amountFreed;
        (amountFreed, loss) = _liquidatePosition(assets);

        // Send it directly back to the vault
        IERC20Upgradeable(asset).safeTransfer(msg.sender, amountFreed);
    }

    /// @notice Shutdown the strategy and revoke it form the lender.
    function shutdown() public nonReentrant onlyOwner { // need check nonReentrant to avoid cyclic call
        _pause();
        lender.revokeStrategy(address(this));
    }

    /// @notice Sets the debt threshold.
    /// @param _debtThreshold The new debt threshold value.
    function setDebtThreshold(uint256 _debtThreshold) external onlyOwner {
        debtThreshold = _debtThreshold;
        emit DebtThresholdUpdated(_debtThreshold);
    }

    /// @notice Sets the estimated gas that will be required for "work" function.
    /// @param _estimatedWorkGas The estimated "work" gas value.
    function setEstimatedWorkGas(uint256 _estimatedWorkGas) external onlyOwner {
        estimatedWorkGas = _estimatedWorkGas;
        emit EstimatedWorkGasUpdated(_estimatedWorkGas);
    }

    /// @notice Sets the profit factor.
    /// @param _profitFactor The new profit factor value.
    function setProfitFactor(uint256 _profitFactor) external onlyOwner {
        profitFactor = _profitFactor;
        emit UpdatedProfitFactor(_profitFactor);
    }

    /// @notice Frees up as much funds of the base protocol as possible.
    /// @dev This function is called on harvest if the strategy was shutted down.
    /// @param outstandingDebt The outstanding debt of the strategy.
    function _harvestAfterShutdown(uint256 outstandingDebt)
        internal
        virtual
        returns (
            uint256 profit,
            uint256 loss,
            uint256 debtPayment
        )
    {
        uint256 amountFreed = _liquidateAllPositions();
        if (amountFreed < outstandingDebt) {
            loss = outstandingDebt - amountFreed;
        } else if (amountFreed > outstandingDebt) {
            profit = amountFreed - outstandingDebt;
        }
        debtPayment = outstandingDebt - loss;
    }

    /// @notice Calculates the gas price of the current transaction (in USD).
    function _gasPriceUSD() internal view returns (uint256) {
        return _nativeTokenPriceFeed.convertAmount(tx.gasprice, 18);
    }

    /// @notice Calculates the pice of the specified amount of "asset" (in USD).
    function _convertAmountToUSD(uint256 amount)
        internal
        view
        returns (uint256)
    {
        return _assetPriceFeed.convertAmount(amount, _assetDecimals);
    }

    /// @notice Sets the max token allowance for the specified spender.
    function approveTokenMax(address token, address spender) internal {
        IERC20Upgradeable(token).safeApprove(spender, type(uint256).max);
    }

    /// @notice Set minimum time between executions.
    /// @param time - required time which must pass between executions of the job in seconds.
    /// Set in hours to prevent block timestamp vulnerability
    function setMinimumBetweenExecutions(uint256 time) public onlyOwner {
        _setMinimumBetweenExecutions(time);
    }

    /// @notice Estimates the total amount of strategy funds (including those invested in the base protocol).
    function estimatedTotalAssets() public view virtual returns (uint256);

    /// @notice The main function of the strategy.
    /// By calling this function, the strategy must realize (take out) the possible profits from the underlying protocol.
    function _harvest(uint256 outstandingDebt)
        internal
        virtual
        returns (
            uint256 profit,
            uint256 loss,
            uint256 debtPayment
        );

    /// @notice Performs the deposit of the free funds to the underlying protocol.
    function _adjustPosition(uint256 outstandingDebt) internal virtual;

    /// @notice Withdraws the specific amount of "asset" from the underlying protocol.
    /// @param assets The amount of token to withdraw.
    /// @return liquidatedAmount Withdrawn amount
    /// @return loss The amount that could not be withdrawn
    function _liquidatePosition(uint256 assets)
        internal
        virtual
        returns (uint256 liquidatedAmount, uint256 loss);

    /// @notice Withdraws the entire invested amount from the underlying protocol.
    function _liquidateAllPositions()
        internal
        virtual
        returns (uint256 amountFreed);

    /// @dev Fallback function that is called when the health check fails.
    function healthCheckFailedFallback() internal virtual override{
        shutdown();
    }
}
