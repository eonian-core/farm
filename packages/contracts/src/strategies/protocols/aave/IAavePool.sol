// SPDX-License-Identifier: GNU AGPLv3
pragma solidity ^0.8.26;

import {DataTypes} from './DataTypes.sol';

interface IAavePool {
  function deposit(address asset, uint256 amount, address onBehalfOf, uint16 referralCode) external;

  function withdraw(address asset, uint256 amount, address to) external;

  function getReserveData(address asset) external view returns (DataTypes.ReserveData memory);
}
