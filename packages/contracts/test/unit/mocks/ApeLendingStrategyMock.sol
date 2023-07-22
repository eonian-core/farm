// SPDX-License-Identifier: AGPL-3.0-only
pragma solidity >=0.8.0;

import "contracts/strategies/ApeLendingStrategy.sol";


contract ApeLendingStrategyMock is ApeLendingStrategy {
    event LiquidatePositionCalled(uint256 assets);

    constructor(
        address _vault,
        address _asset,
        address _cToken,
        address _ops,
        address __nativeTokenPriceFeed,
        address __assetPriceFeed,
        uint256 _minReportInterval,
        bool _isPrepaid
    ) ApeLendingStrategy(false) {
        initialize(
            _vault,
            _asset,
            _cToken,
            _ops,
            __nativeTokenPriceFeed,
            __assetPriceFeed,
            _minReportInterval,
            _isPrepaid,
            1_500
        );
    }

    function estimatedAccruedBanana() public view returns (uint256) {
        return super._estimatedAccruedBanana();
    }

    function estimatedAccruedBananaPerBlock() public view returns (uint256) {
        return super._estimatedAccruedBananaPerBlock();
    }

    function currentBananaBalance() public view returns (uint256) {
        return super._currentBananaBalance();
    }

    function totalBananaBalanceInAsset() public view returns (uint256) {
        return super._totalBananaBalanceInAsset();
    }

    function tokenSwapPath(address tokenIn, address tokenOut)
        public
        pure
        returns (address[] memory path)
    {
        return super._tokenSwapPath(tokenIn, tokenOut);
    }

    function claimBanana() public {
        return super._claimBanana();
    }

    function swapBananaToAsset() public {
        return super._swapBananaToAsset();
    }

    function harvest(uint256 outstandingDebt)
        public
        returns (
            uint256 profit,
            uint256 loss,
            uint256 debtPayment
        )
    {
        return super._harvest(outstandingDebt);
    }

    function adjustPosition(uint256 outstandingDebt) public {
        return super._adjustPosition(outstandingDebt);
    }

    function emitLiquidatePositionCalled(uint256 assets) public {
        emit LiquidatePositionCalled(assets);
    }

    function _liquidatePosition(uint256 assets)
        internal
        override
        returns (uint256 liquidatedAmount, uint256 loss)
    {
        emitLiquidatePositionCalled(assets);

        return super._liquidatePosition(assets);
    }

    function liquidatePosition(uint256 assets)
        public
        returns (uint256 liquidatedAmount, uint256 loss)
    {
        return _liquidatePosition(assets);
    }

    function liquidateAllPositions() public returns (uint256 amountFreed) {
        return super._liquidateAllPositions();
    }
}
