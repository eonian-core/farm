// SPDX-License-Identifier: AGPL-3.0
pragma solidity ^0.8.19;

import {Job} from "./Job.sol";
import {IResolver} from "./gelato/IResolver.sol";
import {OpsReady, IOps} from "./gelato/OpsReady.sol";

/// @notice Contract expect work will be prepayd, so it cannot pay for work
error PayableWorkNotAllowed();

/// @title Implementation of the mixin that adds support for Gelato (keepers operator)
abstract contract GelatoJobAdapter is Job, IResolver, OpsReady {
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
        canExec = canWork();

        execPayload = abi.encodeWithSelector(
            isPrepaid ? this.work.selector : this.payableWork.selector
        );
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
