// SPDX-License-Identifier: MIT
pragma solidity >=0.8.10;

import {GelatoJobAdapter} from "../GelatoJobAdapter.sol";
import {OwnableUpgradeable} from "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";

contract SimpleGelatoJob is GelatoJobAdapter, OwnableUpgradeable {
    uint256 public workMethodCalledCounter;
    bool public canWorkResult = false;

    // allow sending eth to the test contract
    receive() external payable {}

    function initialize(
        address _ops,
        uint256 _minimumBetweenExecutions,
        bool _isPrepayd
    ) public initializer {
        __GelatoJobAdapter_init(_ops, _minimumBetweenExecutions, _isPrepayd);

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

    function setIsPrepayd(bool _isPrepayd) public onlyOwner {
        isPrepayd = _isPrepayd;
    }

    function allowWorkNow() public onlyOwner {
        lastWorkTime = 0;
    }
}
