// SPDX-License-Identifier: GNU AGPLv3
pragma solidity ^0.8.26;

import {IJob} from "./IJob.sol";
import {Job} from "./Job.sol";
import {OpsReady, IOps} from "./gelato/OpsReady.sol";
import {IChecker} from "./gelato/IChecker.sol";
import {IPayableJob} from "./IPayableJob.sol";

/// @notice Contract expect work will be prepayd, so it cannot pay for work
error PayableWorkNotAllowed();

/// @title Implementation of the mixin that adds support for Gelato (keepers operator)
abstract contract GelatoJobAdapter is Job, IChecker, OpsReady, IPayableJob {
    /// @notice If job is prepaid, then it not will try to pay on executed work.
    bool public isPrepaid;

    /**
     * @dev This empty reserved space is put in place to allow future versions to add new
     * variables without shifting down storage in the inheritance chain.
     * See https://docs.openzeppelin.com/contracts/4.x/upgradeable#storage_gaps
     */
    uint256[50] private __gap;

    // ------------------------------------------ Constructors ------------------------------------------

    /**
     * @notice Constructor of Job adapter contract.
     * @param _ops - address of the Ops contract.
     * @param _minimumBetweenExecutions - required time which must pass between executions of the job in seconds.
     * @param _isPrepaid - If job is prepaid, then it not will try to pay on executed work
     */
    function __GelatoJobAdapter_init(
        IOps _ops,
        uint256 _minimumBetweenExecutions,
        bool _isPrepaid
    ) internal onlyInitializing {
        __OpsReady_init(_ops);
        __Job_init(_minimumBetweenExecutions);

        __GelatoJobAdapter_init_unchained(_isPrepaid);
    }

    /**
     * @notice Unchained constructor of Job adapter contract without rest of the contracts init
     * @param _isPrepaid - If job is prepaid, then it not will try to pay on executed work
     */
    function __GelatoJobAdapter_init_unchained(bool _isPrepaid)
        internal
        onlyInitializing
    {
        isPrepaid = _isPrepaid;
    }

    /// @notice Resolver checker that says if the work can be performed and with what params.
    function checker()
        public
        view
        returns (bool canExec, bytes memory execPayload)
    {
        (canExec, execPayload) = canWork();
        if(!canExec) {
            return (canExec, execPayload);
        }

        execPayload = isPrepaid 
            ? abi.encodeCall(IJob.work, ()) 
            : abi.encodeCall(IPayableJob.payableWork, ());
    }

    /// @notice Bot will call this method when `checker` returns `true`.
    /// Will pay caller
    /// `_doWork` method stay as it is, to allow a call off-chain
    function payableWork() public nonReentrant onlyOps {
        if (isPrepaid) {
            revert PayableWorkNotAllowed();
        }

        _doWork();

        // Check -> Effect -> Interaction
        // To prevent exploits pay only at the end of operations
        _payGalatoFee();
    }
}
