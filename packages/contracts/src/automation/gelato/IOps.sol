// SPDX-License-Identifier: AGPL-3.0
pragma solidity ^0.8.19;

/// @dev Based on https://github.com/gelatodigital/ops
interface IOps {
    function gelato() external view returns (address payable);

    function getFeeDetails() external view returns (uint256, address);
}
