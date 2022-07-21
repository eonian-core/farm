// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/// Based on https://github.com/gelatodigital/ops
interface IOps {
    function gelato() external view returns (address payable);
    function getFeeDetails() external view returns (uint256, address);
}