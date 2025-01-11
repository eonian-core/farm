// SPDX-License-Identifier: AGPL-3.0
pragma solidity >=0.8.0;

import 'contracts/strategies/AaveSupplyStrategy.sol';

contract AaveSupplyStrategyMock is AaveSupplyStrategy {
  constructor(
    IStrategiesLender _vault,
    IERC20Upgradeable _asset,
    IAavePool _pool,
    IOps _ops,
    AggregatorV3Interface _nativeTokenPriceFeed,
    AggregatorV3Interface _assetPriceFeed
  ) AaveSupplyStrategy(false) {
    initialize(_vault, _asset, _pool, _ops, 60000, false, _nativeTokenPriceFeed, _assetPriceFeed, address(0), 3);
  }

  function harvest(uint256 outstandingDebt) public returns (uint256 profit, uint256 loss, uint256 debtPayment) {
    return super._harvest(outstandingDebt);
  }

  function callWork() external {
    super._work();
  }

  function adjustPosition(uint256 outstandingDebt) public {
    return super._adjustPosition(outstandingDebt);
  }

  function liquidatePosition(uint256 assets) public returns (uint256 liquidatedAmount, uint256 loss) {
    return super._liquidatePosition(assets);
  }

  function liquidateAllPositions() public returns (uint256 amountFreed) {
    return super._liquidateAllPositions();
  }

  function freeAssets() public view returns (uint256) {
    return super._freeAssets();
  }

  function pause() public {
    super._pause();
  }
}
