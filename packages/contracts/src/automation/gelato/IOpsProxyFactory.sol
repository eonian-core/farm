// SPDX-License-Identifier: GNU AGPLv3
pragma solidity ^0.8.26;

/// Based on https://github.com/gelatodigital/automate-unit-testing/blob/main/contracts/gelato/Types.sol
interface IOpsProxyFactory {
  function deployFor(address owner) external returns (address payable proxy);
  function getProxyOf(address account) external view returns (address, bool);
  function deploy() external returns (address payable proxy);
}