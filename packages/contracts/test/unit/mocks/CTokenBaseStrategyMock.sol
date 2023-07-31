// SPDX-License-Identifier: AGPL-3.0-only
pragma solidity >=0.8.0;

import "contracts/strategies/CTokenBaseStrategy.sol";
import "./SafeInitializableMock.sol";

contract CTokenBaseStrategyMock is CTokenBaseStrategy, SafeInitializableMock {
    event LiquidatePositionCalled(uint256 assets);
    event HarvestCalled();
    event HarvestAfterShutdownCalled();
    event AdjustPositionCalled(uint256 outstandingDebt);

    uint256 public harvestProfit = 0;
    uint256 public harvestLoss = 0;

    uint256 private _liquidateAllPositionsReturn = 0;
    uint256 private _estimatedTotalAssets = 0;

    constructor(
        IStrategiesLender _lender,
        IERC20Upgradeable _asset,
        ICToken _cToken,
        IRainMaker _rainMaker,
        IERC20Upgradeable _compToken,
        IOps _ops,
        AggregatorV3Interface __nativeTokenPriceFeed,
        AggregatorV3Interface __assetPriceFeed,
        uint256 _minReportInterval,
        bool _isPrepaid
    ) initializer {
        __CTokenBaseStrategy_init(
            _lender,
            _asset,
            _cToken,
            _rainMaker,
            _compToken,
            _ops,
            __nativeTokenPriceFeed,
            __assetPriceFeed,
            _minReportInterval,
            _isPrepaid
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

    function callCanWork() external view returns (bool) {
        return _canWork();
    }

    function name() external pure override returns (string memory) {
        return "BaseStrategyMock";
    }

    function estimatedTotalAssets() public view override returns (uint256) {
        return _estimatedTotalAssets;
    }

    function currentBananaBalance() public view returns (uint256) {
        return super._currentBananaBalance();
    }

    function claimBanana() public {
        return super._claimBanana();
    }

    function emitLiquidatePositionCalled(uint256 assets) public {
        emit LiquidatePositionCalled(assets);
    }

    function emitHarvestCalled() public {
        emit HarvestCalled();
    }

    function emitAjustPositionCalled(uint256 outstandingDebt) public {
        emit AdjustPositionCalled(outstandingDebt);
    }

    function _harvest(uint256 outstandingDebt)
        internal
        override
        returns (
            uint256 profit,
            uint256 loss,
            uint256 debtPayment
        )
    {
        emitHarvestCalled();
        return (harvestProfit, harvestLoss, outstandingDebt);
    }

    function checkGasPriceAgainstProfit(uint256 profit)
        external
        view
        returns (bool)
    {
        return _checkGasPriceAgainstProfit(profit);
    }

    function _adjustPosition(uint256 outstandingDebt) internal override {
        emitAjustPositionCalled(outstandingDebt);
    }

    function _liquidatePosition(uint256 assets)
        internal
        override
        returns (uint256 liquidatedAmount, uint256 loss)
    {
        emitLiquidatePositionCalled(assets);
        return (assets, 0);
    }

    function _liquidateAllPositions()
        internal
        view
        override
        returns (uint256 amountFreed)
    {
        return _liquidateAllPositionsReturn;
    }

}
