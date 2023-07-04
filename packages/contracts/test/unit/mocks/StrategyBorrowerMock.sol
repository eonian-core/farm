/// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {BaseStrategyMock, IStrategiesLender, IERC20Upgradeable, IOps, AggregatorV3Interface} from "./BaseStrategyMock.sol";
import {MathUpgradeable} from "@openzeppelin/contracts-upgradeable/utils/math/MathUpgradeable.sol";

/**
    @dev This mock, unlike "BaseStrategyMock", is as close to the real strategy as possible,
    and has an elaborate logic of the position adjustment & liquidation.
 */
contract StrategyBorrowerMock is BaseStrategyMock {
    event AdjustPositionCalled(uint256 outstandingDebt, uint256 adjustedAmount);
    event LiquidatePositionCalled(uint256 liquidated, uint256 loss);

    // The contract where the strategy holds the adjusted (invested) funds.
    AssetHolder internal assetHolder;

    constructor(
        IStrategiesLender _lender,
        IERC20Upgradeable _asset,
        IOps _ops,
        uint256 _minReportInterval,
        bool _isPrepaid,
        AggregatorV3Interface __nativeTokenPriceFeed,
        AggregatorV3Interface __assetPriceFeed
    )
        BaseStrategyMock(
            _lender,
            _asset,
            _ops,
            _minReportInterval,
            _isPrepaid,
            __nativeTokenPriceFeed,
            __assetPriceFeed
        )
    {
        assetHolder = new AssetHolder(_asset);
        approveTokenMax(address(_asset), address(assetHolder));
    }

    function estimatedTotalAssets() public view override returns (uint256) {
        return
            asset.balanceOf(address(this)) +
            asset.balanceOf(address(assetHolder));
    }

    function _adjustPosition(uint256 outstandingDebt) internal override {
        uint256 assetBalance = asset.balanceOf(address(this));
        if (assetBalance < outstandingDebt) {
            return;
        }

        uint256 freeBalance = assetBalance - outstandingDebt;
        if (freeBalance > 0) {
            assetHolder.invest(freeBalance);
        }

        emit AdjustPositionCalled(outstandingDebt, freeBalance);
    }

    function _liquidatePosition(
        uint256 assets
    ) internal override returns (uint256 liquidatedAmount, uint256 loss) {
        uint256 investedBalance = asset.balanceOf(address(assetHolder));
        uint256 toLiquidate = MathUpgradeable.min(investedBalance, assets);
        uint256 potentialLoss = assets - toLiquidate;

        assetHolder.liquidate(toLiquidate);
        emit LiquidatePositionCalled(toLiquidate, potentialLoss);
        
        return (toLiquidate, potentialLoss);
    }

    function _liquidateAllPositions()
        internal
        override
        returns (uint256 amountFreed)
    {
        (uint256 freed,) = _liquidatePosition(asset.balanceOf(address(assetHolder)));
        return freed;
    }

    function name() external pure virtual override returns (string memory) {
        return "StrategyBorrowerMock";
    }

    function TEST_makeLoss(uint256 amount) public {
        assetHolder.burn(amount);
    }

    function _harvest(
        uint256 outstandingDebt
    )
        internal
        override
        returns (uint256 profit, uint256 loss, uint256 debtPayment)
    {
        emitHarvestCalled();
        assetHolder.liquidate(outstandingDebt);
        return (harvestProfit, harvestLoss, outstandingDebt);
    }
}

contract AssetHolder {
    IERC20Upgradeable internal asset;

    constructor(IERC20Upgradeable _asset) {
        asset = _asset;
    }

    function invest(uint256 amount) public {
        asset.transferFrom(msg.sender, address(this), amount);
    }

    function liquidate(uint256 amount) public {
        asset.transfer(msg.sender, amount);
    }

    function burn(uint256 amount) public {
        asset.transfer(0x000000000000000000000000000000000000dEaD, amount);
    }
}
