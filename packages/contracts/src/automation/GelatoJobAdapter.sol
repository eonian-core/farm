// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import { Job } from './Job.sol';
import {IResolver} from './gelato/IResolver.sol';
import {OpsReady} from './gelato/OpsReady.sol';

/// @notice Contract expect work will be prepayd, so it cannot pay for work
error PaybleWorkNotAllowed();

/// @title Implementation of mixin which add support for Gelato (keepers operator)
abstract contract GelatoJobAdapter is Job, IResolver, OpsReady {

    /// @notice If job is preaped, then it not will try to pay on executed work.
    bool public isPrepayd;

    /**
     * @notice Constructor of Job adapter contract.
     * @param _minimumBetweenExecutions - required time which must pass between executions of the job in seconds.
     */
    function __GelatoJobAdapter_init(address _ops, uint256 _minimumBetweenExecutions, bool _isPrepayd) internal onlyInitializing {
        __OpsReady_init(_ops);
        __Job_init(_minimumBetweenExecutions);

        _isPrepayd = isPrepayd;
    }


    /// @notice Resolver checker which say if work can be performed and with which params.
    function checker() public view returns (bool canExec, bytes memory execPayload) {
        canExec = canWork();

        execPayload = abi.encodeWithSelector(isPrepayd ? this.work.selector : this.payableWork.selector);
    }

    /// @notice Bot will call this method when `checker` returns `true`.
    /// Will pay caller
    /// `work` method stay as it is, to allow call id of-chain
    function payableWork() public onlyOps {
        if(isPrepayd){
            revert PaybleWorkNotAllowed();
        }
        
        super.work();

        // Check -> Effect -> Interaction
        // To prevent exploits pay only at the end of operations
        _payGalatoFee();
    }
}