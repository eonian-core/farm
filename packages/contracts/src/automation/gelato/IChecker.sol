// SPDX-License-Identifier: AGPL-3.0
pragma solidity ^0.8.26;

/// Migraed from Gelato Automation IResolver interface
/// @dev Based on https://github.com/gelatodigital/ops/blob/9a9cde6ab2f1b132b949f9244fd59a1de4da4123/contracts/interfaces/IResolver.sol
interface IChecker {

    /// @param canExec (Boolean): Indicates if Gelato should execute the task
    /// @param execPayload (Bytes): Contains the data that executors will use during execution.
    function checker()
        external
        view
        returns (bool canExec, bytes memory execPayload);
}
