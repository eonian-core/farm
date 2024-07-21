// SPDX-License-Identifier: GNU AGPLv3
pragma solidity ^0.8.26;

import {GelatoJobAdapter, IOps} from "../GelatoJobAdapter.sol";

import {SafeUUPSUpgradeable} from "../../upgradeable/SafeUUPSUpgradeable.sol";
import {SafeInitializable} from "../../upgradeable/SafeInitializable.sol";
import {IVersionable} from "../../upgradeable/IVersionable.sol";

error InsufficientBalance();

/// Example of a simple Gelato job implementation
contract SimpleGelatoJob is GelatoJobAdapter, SafeUUPSUpgradeable {
    uint256 public workMethodCalledCounter;
    bool public canWorkResult = false;

    /// @inheritdoc IVersionable
    function version() external pure override returns (string memory) {
        return "0.1.2";
    }

    /// @dev allow sending eth to the test contract
    /// Can be removed in real contract
    receive() external payable {} // solhint-disable-line no-empty-blocks
    
    /// @dev Payable contracts must always have withdrawal method
    /// Also can be removed in real contract
    function withdraw(uint256 amount) public onlyOwner {
        if (address(this).balance < amount) {
            revert InsufficientBalance();
        }
        
        payable(msg.sender).transfer(amount);
    }

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor(bool needDisableInitializers) SafeInitializable(needDisableInitializers) {} // solhint-disable-line no-empty-blocks

    function initialize(
        address _ops,
        uint256 _minimumBetweenExecutions,
        bool _isPrepaid
    ) public initializer {
        __GelatoJobAdapter_init(IOps(_ops), _minimumBetweenExecutions, _isPrepaid);

        __SafeUUPSUpgradeable_init(); // ownable under the hood
    }

    function _work() internal override {
        workMethodCalledCounter++;
    }

    function _canWork() internal view override returns (bool canExec, bytes memory reason) {
        return (canWorkResult, bytes(""));
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
