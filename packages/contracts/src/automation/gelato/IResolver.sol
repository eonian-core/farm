// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/// @dev Copy of https://github.com/gelatodigital/ops/blob/9a9cde6ab2f1b132b949f9244fd59a1de4da4123/contracts/interfaces/IResolver.sol
interface IResolver {
    function checker()
        external
        view
        returns (bool canExec, bytes memory execPayload);
}