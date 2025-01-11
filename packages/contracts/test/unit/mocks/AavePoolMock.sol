// SPDX-License-Identifier: AGPL-3.0
pragma solidity >=0.8.0;

import 'contracts/strategies/protocols/aave/IAavePool.sol';

import {ERC20} from '@openzeppelin/contracts/token/ERC20/ERC20.sol';

import {ERC20Mock} from './ERC20Mock.sol';

contract AavePoolMock is IAavePool {
  ERC20Mock private aToken;

  constructor(ERC20Mock _aToken) {
    aToken = _aToken;
  }

  function deposit(address asset, uint256 amount, address onBehalfOf, uint16) public {
    ERC20Mock(asset).burn(onBehalfOf, amount);
    aToken.mint(onBehalfOf, amount);
  }

  function withdraw(address asset, uint256 amount, address to) public {
    ERC20Mock(asset).mint(to, amount);
    aToken.burn(to, amount);
  }

  function getReserveData(address) public view returns (DataTypes.ReserveData memory) {
    return
      DataTypes.ReserveData({
        configuration: DataTypes.ReserveConfigurationMap(0),
        liquidityIndex: 0,
        currentLiquidityRate: 0,
        variableBorrowIndex: 0,
        currentVariableBorrowRate: 0,
        currentStableBorrowRate: 0,
        lastUpdateTimestamp: 0,
        id: 0,
        aTokenAddress: address(aToken),
        stableDebtTokenAddress: address(0),
        variableDebtTokenAddress: address(0),
        interestRateStrategyAddress: address(0),
        accruedToTreasury: 0,
        unbacked: 0,
        isolationModeTotalDebt: 0
      });
  }
}
