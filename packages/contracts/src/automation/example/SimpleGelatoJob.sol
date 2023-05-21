// SPDX-License-Identifier: AGPL-3.0-or-later
pragma solidity ^0.8.19;

import {Job} from "../Job.sol";
import {OpsReady} from "../gelato/OpsReady.sol";
import {GelatoJobAdapter} from "../GelatoJobAdapter.sol";
import {OwnableUpgradeable} from "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";

contract SimpleGelatoJob is GelatoJobAdapter, OwnableUpgradeable {
    uint256 public workMethodCalledCounter;
    bool public canWorkResult = false;

    // allow sending eth to the test contract
    receive() external payable {} // solhint-disable-line no-empty-blocks

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor(bool needDisableInitializers) Job(needDisableInitializers) OpsReady(needDisableInitializers){
    }

    function initialize(
        address _ops,
        uint256 _minimumBetweenExecutions,
        bool _isPrepaid
    ) public initializer {
        __GelatoJobAdapter_init(_ops, _minimumBetweenExecutions, _isPrepaid);

        __Ownable_init();
    }

    function _work() internal override {
        workMethodCalledCounter++;
    }

    function _canWork() internal view override returns (bool) {
        return canWorkResult;
    }

    function setCanWorkResult(bool _canWorkResult) public onlyOwner {
        canWorkResult = _canWorkResult;
    }

    function setMinimumBetweenExecutions(uint256 _time) public onlyOwner {
        _setMinimumBetweenExecutions(_time);
    }

    function setIsPrepaid(bool _isPrepaid) public onlyOwner {
        isPrepaid = _isPrepaid;
    }

    function allowWorkNow() public onlyOwner {
        lastWorkTime = 0;
    }

    function refreshLastWorkTime() public onlyOwner {
        _refreshLastWorkTime();
    }
}
