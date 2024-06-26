// SPDX-License-Identifier: AGPL-3.0-only
pragma solidity >=0.8.0;

import "contracts/automation/Job.sol";

import "./SafeInitializableMock.sol";

contract JobMock is Job, SafeInitializableMock {

    uint256 public workMethodCalledCounter;
    bool public canWorkResult = false;

    function __JobMock_init(uint256 _minimumBetweenExecutions) public initializer {
        __Job_init(_minimumBetweenExecutions);
    }

    function _work() internal override {
        workMethodCalledCounter++;
    }

    function _canWork() internal view override returns (bool canExec, bytes memory reason) {
        return (canWorkResult, bytes(""));
    }

    function setCanWorkResult(bool _canWorkResult) public {
        canWorkResult = _canWorkResult;
    }

    function refreshLastWorkTime() public {
        _refreshLastWorkTime();
    }

    function setMinimumBetweenExecutions(uint256 _time) public {
        _setMinimumBetweenExecutions(_time);
    }

    function emitWorked(address worker) public {
        emit Worked(worker);
    }
}
