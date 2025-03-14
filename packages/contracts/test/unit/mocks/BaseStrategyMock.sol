// SPDX-License-Identifier: AGPL-3.0
pragma solidity >=0.8.0;

import "contracts/strategies/BaseStrategy.sol";
import "./SafeInitializableMock.sol";
import "./VaultMock.sol";

contract BaseStrategyMock is BaseStrategy, SafeInitializableMock {
    event HarvestCalled();
    event HarvestAfterShutdownCalled();
    event AdjustPositionCalled(uint256 outstandingDebt);
    event LiquidatePositionCalled(uint256 assets);

    uint256 public harvestProfit = 0;
    uint256 public harvestLoss = 0;
    uint256 public override interestRatePerBlock;

    uint256 private _liquidateAllPositionsReturn = 0;
    uint256 private _estimatedTotalAssets = 0;

    constructor(
        IStrategiesLender _lender,
        IERC20Upgradeable _asset,
        IOps _ops,
        uint256 _minReportInterval,
        bool _isPrepaid,
        AggregatorV3Interface __nativeTokenPriceFeed,
        AggregatorV3Interface __assetPriceFeed,
        address _healthCheck
    ) initializer {
        __BaseStrategy_init(
            _lender,
            _asset,
            _ops,
            _minReportInterval,
            _isPrepaid,
            __nativeTokenPriceFeed,
            __assetPriceFeed,
            _healthCheck
        );
    }

    function setHarvestProfit(uint256 _harvestProfit) external {
        harvestProfit = _harvestProfit;
    }

    function setEstimatedTotalAssets(uint256 __estimatedTotalAssets) external {
        _estimatedTotalAssets = __estimatedTotalAssets;
    }

    function setHarvestLoss(uint256 _harvestLoss) external {
        harvestLoss = _harvestLoss;
    }

    function setLiquidateAllPositionsReturn(
        uint256 __liquidateAllPositionsReturn
    ) external {
        _liquidateAllPositionsReturn = __liquidateAllPositionsReturn;
    }

    function callWork() external {
        _work();
    }

    function callCanWork() external view returns (bool canExec, bytes memory reason) {
        return _canWork();
    }

    function name() external pure virtual override returns (string memory) {
        return "BaseStrategyMock";
    }

    function estimatedTotalAssets() public virtual view override returns (uint256) {
        return _estimatedTotalAssets;
    }

    function get_nativeTokenPriceFeed() public view returns (AggregatorV3Interface) {
        return _nativeTokenPriceFeed;
    }
    
    function get_assetPriceFeed() public view returns (AggregatorV3Interface) {
        return _assetPriceFeed;
    }

    function emitHarvestCalled() public {
        emit HarvestCalled();
    }

    function emitHarvestAfterShutdownCalled() public {
        emit HarvestAfterShutdownCalled();
    }

    function emitAjustPositionCalled(uint256 outstandingDebt) public {
        emit AdjustPositionCalled(outstandingDebt);
    }

    function emitLiquidatePositionCalled(uint256 assets) public {
        emit LiquidatePositionCalled(assets);
    }

    function emitDebtThresholdUpdated(uint256 debtThreshold) public {
        emit DebtThresholdUpdated(debtThreshold);
    }

    function emitEstimatedWorkGasUpdated(uint256 estimatedWorkGas) public {
        emit EstimatedWorkGasUpdated(estimatedWorkGas);
    }

    function emitUpdatedProfitFactor(uint256 profitFactor) public {
        emit UpdatedProfitFactor(profitFactor);
    }

    function emitNativeTokenPriceFeedUpdated(AggregatorV3Interface priceFeed) public {
        emit NativeTokenPriceFeedUpdated(priceFeed);
    }

    function emitAssetPriceFeedUpdated(AggregatorV3Interface priceFeed) public {
        emit AssetPriceFeedUpdated(priceFeed);
    }

    function emitHealthCheckTriggered(uint8 result) public {
        emit HealthCheckTriggered(result);
    }

    function _harvestAfterShutdown(
        uint256 outstandingDebt
    )
        internal
        override
        returns (uint256 profit, uint256 loss, uint256 debtPayment)
    {
        emitHarvestAfterShutdownCalled();
        return super._harvestAfterShutdown(outstandingDebt);
    }

    function harvestAfterShutdown(
        uint256 outstandingDebt
    ) public returns (uint256 profit, uint256 loss, uint256 debtPayment) {
        return _harvestAfterShutdown(outstandingDebt);
    }

    function _harvest(
        uint256 outstandingDebt
    )
        internal
        override
        virtual
        returns (uint256 profit, uint256 loss, uint256 debtPayment)
    {
        emitHarvestCalled();
        return (harvestProfit, harvestLoss, outstandingDebt);
    }

    function checkGasPriceAgainstProfit(
        uint256 profit
    ) external view returns (bool) {
        return _checkGasPriceAgainstProfit(profit);
    }

    function _adjustPosition(
        uint256 outstandingDebt
    ) internal virtual override {
        emitAjustPositionCalled(outstandingDebt);
    }

    function _liquidatePosition(
        uint256 assets
    )
        internal
        virtual
        override
        returns (uint256 liquidatedAmount, uint256 loss)
    {
        emitLiquidatePositionCalled(assets);
        return (assets, 0);
    }

    function _liquidateAllPositions()
        internal
        virtual
        override
        returns (uint256 amountFreed)
    {
        return _liquidateAllPositionsReturn;
    }

    function freeAssets() public view returns (uint256) {
        return _freeAssets();
    }
}
