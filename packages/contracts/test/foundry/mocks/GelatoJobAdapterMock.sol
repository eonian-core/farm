// SPDX-License-Identifier: AGPL-3.0-only
pragma solidity >=0.8.0;

import "contracts/automation/GelatoJobAdapter.sol";

contract GelatoJobAdapterMock is GelatoJobAdapter {

    uint256 public workMethodCalledCounter;
    bool public canWorkResult = false;

    // allow sending eth to the test contract
    receive() external payable {}

    function __GelatoJobAdapterMock_init(address _ops, uint256 _minimumBetweenExecutions, bool _isPrepayd) public initializer {
        __GelatoJobAdapter_init(_ops, _minimumBetweenExecutions, _isPrepayd);
    }

    function _work() internal override {
        workMethodCalledCounter++;
    }

    function _canWork() internal view override returns (bool) {
        return canWorkResult;
    }

    function setCanWorkResult(bool _canWorkResult) public {
        canWorkResult = _canWorkResult;
    }

    function setMinimumBetweenExecutions(uint256 _time) public {
        _setMinimumBetweenExecutions(_time);
    }

    function emitWorked(address worker) public {
        emit Worked(worker);
    }

    function setIsPrepayd(bool _isPrepayd) public {
        isPrepayd = _isPrepayd;
    }

    function refreshLastWorkTime() public {
        _refreshLastWorkTime();
    }
}
