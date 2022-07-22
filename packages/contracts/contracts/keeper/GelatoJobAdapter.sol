// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import { Job } from './Job.sol';
import {IResolver} from '../libs/gelato/IResolver.sol';
import {OpsReady} from '../libs/gelato/OpsReady.sol';

/// @title Implementation of mixin which add support for Gelato (keepers operator)
abstract contract GelatoJobAdapter is Job, IResolver, OpsReady {

    // TODO: rewrite it to upgradable implementation
    // solhint-disable no-empty-blocks
    constructor(address _ops) OpsReady(_ops) {}

    /// @notice Resolver checker which say if work can be performed and with which params.
    function checker() public view returns (bool canExec, bytes memory execPayload) {
        canExec = canWork();

        execPayload = abi.encodeWithSelector(this.work.selector);
    }

    function work() public override onlyOps {
        super.work();

        _payGalatoFee();
    }
}