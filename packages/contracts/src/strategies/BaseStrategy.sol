// SPDX-License-Identifier: GPL-3.0-only
pragma solidity ^0.8.19;

import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";
import "@openzeppelin/contracts-upgradeable/security/PausableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/IERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/extensions/IERC20MetadataUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/utils/SafeERC20Upgradeable.sol";

import "./IStrategy.sol";
import "../IVault.sol";
import "../automation/GelatoJobAdapter.sol";
import "../healthcheck/HealthChecker.sol";
import "../structures/PriceConverter.sol";

error CallerIsNotAVault();
error IncompatiblePriceFeeds();

abstract contract BaseStrategy is
    IStrategy,
    GelatoJobAdapter,
    HealthChecker,
    PausableUpgradeable
{
    using SafeERC20Upgradeable for IERC20Upgradeable;
    using PriceConverter for AggregatorV3Interface;

    IVault public vault;
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

    event Harvested(
        uint256 profit,
        uint256 loss,
        uint256 debtPayment,
        uint256 outstandingDebt
    );

    event DebtThresholdUpdated(uint256 debtThreshold);

    event EstimatedWorkGasUpdated(uint256 estimatedWorkGas);

    event UpdatedProfitFactor(uint256 profitFactor);

    modifier onlyVault() {
        if (msg.sender != address(vault)) {
            revert CallerIsNotAVault();
        }
        _;
    }

    function __BaseStrategy_init(
        IVault _vault,
        address _ops,
        uint256 _minReportInterval,
        bool _isPrepaid,
        address __nativeTokenPriceFeed,
        address __assetPriceFeed,
        address _healthCheck
    ) internal onlyInitializing {
        __HealthChecker_init(_healthCheck);
        __Pausable_init();
        __GelatoJobAdapter_init(_ops, _minReportInterval, _isPrepaid);

        __BaseStrategy_init_unchained(
            _vault,
            __nativeTokenPriceFeed,
            __assetPriceFeed
        );
    }

    function __BaseStrategy_init_unchained(
        IVault _vault,
        address __nativeTokenPriceFeed,
        address __assetPriceFeed
    ) internal onlyInitializing {
        vault = _vault;
        asset = IVault(vault).asset();

        debtThreshold = 0;
        estimatedWorkGas = 0;
        profitFactor = 100;

        _nativeTokenPriceFeed = AggregatorV3Interface(__nativeTokenPriceFeed);
        _assetPriceFeed = AggregatorV3Interface(__assetPriceFeed);
        if (_nativeTokenPriceFeed.decimals() != _assetPriceFeed.decimals()) {
            revert IncompatiblePriceFeeds();
        }

        _assetDecimals = IERC20MetadataUpgradeable(address(asset)).decimals();

        approveTokenMax(address(asset), address(_vault));
    }

    /// @notice Harvests the strategy, recognizing any profits or losses and adjusting the strategy's investments.
    /// @inheritdoc Job
    function _work() internal override {
        uint256 profit = 0;
        uint256 loss = 0;
        uint256 debtPayment = 0;

        uint256 outstandingDebt = vault.outstandingDebt();
        if (paused()) {
            (profit, loss, debtPayment) = _harvestAfterShutdown(
                outstandingDebt
            );
        } else {
            (profit, loss, debtPayment) = _harvest(outstandingDebt);
        }

        if (profit > 0) {
            vault.reportPositiveDebtManagement(profit, debtPayment);
        } else {
            vault.reportNegativeDebtManagement(loss, debtPayment);
        }

        // If the strategy needs to repay the entire debt, we need to take all available funds.
        // We will take the current debt in the report above, but we still need to free up whatever is left.
        // This can happen, if the ratio is reduced to 0 or if the vault has been shutted down.
        outstandingDebt = vault.outstandingDebt();
        outstandingDebt = vault.currentDebtRatio() == 0 || vault.paused()
            ? estimatedTotalAssets()
            : outstandingDebt;

        _adjustPosition(outstandingDebt);

        uint256 totalDebt = vault.currentDebt();
        performHealthCheck(
            address(this),
            profit,
            loss,
            debtPayment,
            outstandingDebt,
            totalDebt
        );

        emit Harvested(profit, loss, debtPayment, outstandingDebt);
    }

    /// @inheritdoc Job
    function _canWork() internal view override returns (bool) {
        if (!vault.isActivated()) {
            return false;
        }

        // Trigger this job if the strategy has the outstanding debt to repay
        uint256 outstanding = vault.outstandingDebt();
        if (outstanding > debtThreshold) {
            return true;
        }

        // Trigger this job if the strategy has some loss to report
        uint256 total = estimatedTotalAssets();
        uint256 debt = vault.currentDebt();
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
    function _checkGasPriceAgainstProfit(uint256 profit)
        internal
        view
        returns (bool)
    {
        uint256 credit = vault.availableCredit();
        uint256 gasCost = _gasPriceUSD() * estimatedWorkGas;
        return profitFactor * gasCost < _convertAmountToUSD(credit + profit);
    }

    /// @inheritdoc IStrategy
    function withdraw(uint256 assets)
        external
        override
        onlyVault
        returns (uint256 loss)
    {
        // Liquidate the requested amount of tokens
        uint256 amountFreed;
        (amountFreed, loss) = _liquidatePosition(assets);

        // Send it directly back to the vault
        IERC20Upgradeable(asset).safeTransfer(msg.sender, amountFreed);
    }

    /// @notice Shutdown the strategy and revoke it form the vault.
    function shutdown() external onlyOwner {
        _pause();
        IVault(vault).revokeStrategy(address(this));
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
}
