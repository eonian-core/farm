// SPDX-License-Identifier: GPL-3.0-only
pragma solidity ^0.8.0;

import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/PausableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/IERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/extensions/IERC20MetadataUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/utils/SafeERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/math/SafeMathUpgradeable.sol";

import "./IStrategy.sol";
import "../IVault.sol";
import "../automation/GelatoJobAdapter.sol";

error CallerIsNotAVault();
error UncompatiblePriceFeeds();

abstract contract BaseStrategy is
    IStrategy,
    GelatoJobAdapter,
    OwnableUpgradeable,
    PausableUpgradeable
{
    using SafeERC20Upgradeable for IERC20Upgradeable;
    using SafeMathUpgradeable for uint256;

    IVault public vault;
    IERC20Upgradeable public asset;

    /// @notice Use this to adjust the threshold at which running a debt causes a work trigger.
    uint256 public debtThreshold;

    /// @notice The estimated amount of gas required for the "work" execution.
    uint256 public estimatedWorkGas;

    /// @notice Shows how many times higher the profit should be than the spent gas for the "work" function.
    uint256 public profitFactor;

    /// @notice The USD price feed for the native token of the network on which this strategy works.
    AggregatorV3Interface internal nativeTokenPriceFeed;

    /// @notice The USD price feed for the strategy asset.
    AggregatorV3Interface internal assetPriceFeed;

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
        address _nativeTokenPriceFeed,
        address _assetPriceFeed,
        uint256 _minReportInterval,
        bool _isPrepaid
    ) internal onlyInitializing {
        __Ownable_init();
        __Pausable_init();
        __GelatoJobAdapter_init(_ops, _minReportInterval, _isPrepaid);

        __BaseStrategy_init_unchained(
            _vault,
            _nativeTokenPriceFeed,
            _assetPriceFeed
        );
    }

    function __BaseStrategy_init_unchained(
        IVault _vault,
        address _nativeTokenPriceFeed,
        address _assetPriceFeed
    ) internal onlyInitializing {
        vault = _vault;
        asset = IVault(vault).asset();

        debtThreshold = 0;
        estimatedWorkGas = 0;
        profitFactor = 100;

        nativeTokenPriceFeed = AggregatorV3Interface(_nativeTokenPriceFeed);
        assetPriceFeed = AggregatorV3Interface(_assetPriceFeed);
        if (nativeTokenPriceFeed.decimals() != assetPriceFeed.decimals()) {
            revert UncompatiblePriceFeeds();
        }

        IERC20Upgradeable(asset).safeApprove(
            address(_vault),
            type(uint256).max
        );
    }

    /// @inheritdoc Job
    function _work() internal override {
        uint256 profit = 0;
        uint256 loss = 0;
        uint256 debtPayment = 0;

        uint256 outstandingDebt = IVault(vault).outstandingDebt();
        bool shuttedDown = paused();
        if (shuttedDown) {
            (profit, loss, debtPayment) = _harvestAfterShutdown(
                outstandingDebt
            );
        } else {
            (profit, loss, debtPayment) = _harvest(outstandingDebt);
        }

        if (profit > 0) {
            IVault(vault).reportPositiveDebtManagement(profit, debtPayment);
        } else {
            IVault(vault).reportNegativeDebtManagement(loss, debtPayment);
        }

        // If the strategy needs to repay the entire debt, we need to take all available funds.
        // We will take the current debt in the report in the previous step, but we still need to free up whatever is left.
        // This can happen, if the ratio is reduced to 0 or if the vault has been shutted down.
        outstandingDebt = IVault(vault).outstandingDebt();
        outstandingDebt = outstandingDebt == IVault(vault).currentDebt()
            ? estimatedTotalAssets()
            : outstandingDebt;

        _adjustPosition(outstandingDebt);

        // TODO: Perform the health check (?)

        emit Harvested(profit, loss, debtPayment, outstandingDebt);
    }

    /// @inheritdoc Job
    function _canWork() internal view override returns (bool) {
        IVault _vault = IVault(vault);
        if (_vault.isActivated()) {
            return false;
        }

        // Trigger this job if the strategy has the outstanding debt to repay
        uint256 outstanding = _vault.outstandingDebt();
        if (outstanding > debtThreshold) {
            return true;
        }

        // Trigger this job if the strategy has some loss to report
        uint256 total = estimatedTotalAssets();
        uint256 debt = _vault.currentDebt();
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
        uint256 credit = _vault.availableCredit();
        uint256 gasCost = _gasPriceUSD() * estimatedWorkGas;
        return profitFactor * gasCost < _assetAmountUSD(credit + profit);
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

    function setDebtThreshold(uint256 _debtThreshold) external onlyOwner {
        debtThreshold = _debtThreshold;
        emit DebtThresholdUpdated(_debtThreshold);
    }

    function setEstimatedWorkGas(uint256 _estimatedWorkGas) external onlyOwner {
        estimatedWorkGas = _estimatedWorkGas;
        emit EstimatedWorkGasUpdated(_estimatedWorkGas);
    }

    function setProfitFactor(uint256 _profitFactor) external onlyOwner {
        profitFactor = _profitFactor;
        emit UpdatedProfitFactor(_profitFactor);
    }

    function _harvestAfterShutdown(uint256 outstandingDebt)
        private
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

    function _gasPriceUSD() private view returns (uint256) {
        return _convertToUSD(tx.gasprice, 18);
    }

    function _assetAmountUSD(uint256 amount) private view returns (uint256) {
        uint256 decimals = IERC20MetadataUpgradeable(address(asset)).decimals();
        return _convertToUSD(amount, decimals);
    }

    function _convertToUSD(uint256 amount, uint256 decimals)
        private
        view
        returns (uint256)
    {
        (, int256 price, , , ) = nativeTokenPriceFeed.latestRoundData();
        uint256 priceFeedDecimals = nativeTokenPriceFeed.decimals();
        (, uint256 upToDecimals) = decimals.trySub(priceFeedDecimals);
        return (amount * uint256(price) * 10**upToDecimals) / 10**decimals;
    }

    function estimatedTotalAssets() public view virtual returns (uint256);

    function _harvest(uint256 outstandingDebt)
        internal
        virtual
        returns (
            uint256 profit,
            uint256 loss,
            uint256 debtPayment
        );

    function _adjustPosition(uint256 outstandingDebt) internal virtual;

    function _liquidatePosition(uint256 assets)
        internal
        virtual
        returns (uint256 liquidatedAmount, uint256 loss);

    function _liquidateAllPositions()
        internal
        virtual
        returns (uint256 amountFreed);
}
