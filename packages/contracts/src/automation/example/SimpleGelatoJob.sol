// SPDX-License-Identifier: AGPL-3.0
pragma solidity ^0.8.19;

import {GelatoJobAdapter} from "../GelatoJobAdapter.sol";

import {SafeUUPSUpgradeable} from "../../upgradeable/SafeUUPSUpgradeable.sol";
import {SafeInitializable} from "../../upgradeable/SafeInitializable.sol";

contract SimpleGelatoJob is GelatoJobAdapter, SafeUUPSUpgradeable {
    uint256 public workMethodCalledCounter;
    bool public canWorkResult = false;

    // allow sending eth to the test contract
    receive() external payable {} // solhint-disable-line no-empty-blocks

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor(bool needDisableInitializers) SafeInitializable(needDisableInitializers) {} // solhint-disable-line no-empty-blocks

    function initialize(
        address _ops,
        uint256 _minimumBetweenExecutions,
        bool _isPrepaid
    ) public initializer {
        __GelatoJobAdapter_init(_ops, _minimumBetweenExecutions, _isPrepaid);

        __SafeUUPSUpgradeable_init(); // ownable under the hood
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
