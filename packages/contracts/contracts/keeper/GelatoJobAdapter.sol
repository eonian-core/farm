// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import {ReentrancyGuard} from "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import { Job } from './Job.sol';
import {IResolver} from '../libs/gelato/IResolver.sol';
import {OpsReady} from '../libs/gelato/OpsReady.sol';

/// @title Implementation of mixin which add support for Gelato (keepers operator)
abstract contract GelatoJobAdapter is Job, ReentrancyGuard, IResolver, OpsReady {

    /// @notice Mininmal time which must pass between executions of the job in seconds.
    /// Must be greater then 900 seconds, or node opperators will be able to manipulate.
    uint256 public minimumBetweenExecutions = 1000;

    // solhint-disable no-empty-blocks
    constructor(address _ops) OpsReady(_ops) {}

    function checker() public view returns (bool canExec, bytes memory execPayload) {
        // TODO: maybe move it to Job contract itself
        canExec = isTimePassFromLastExecution(minimumBetweenExecutions) && _canWork();

        execPayload = abi.encodeWithSelector(this.work.selector);
    }

    modifier allowedByChecker() { 
        (bool canExec, bytes memory execPayload) = checker();

        require(canExec, "Not allowed by checker");
        _;
    }

    // TODO: possible do not use nonReentrant if we have isTimePassFromLastExecution check
    function work() external nonReentrant onlyOps allowedByChecker {
        refreshExecutionTime();
        
        _work();
        
        _payGalatoFee();
    }
}