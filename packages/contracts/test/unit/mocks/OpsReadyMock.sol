/// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "contracts/automation/gelato/OpsReady.sol";

import "./SafeInitializableMock.sol";

/// Testing implementation of OpsReady
contract OpsReadyMock is OpsReady, SafeInitializableMock {

    uint256 public onlyOpsProtectedCalledTimes;

    // allow sending eth to the test contract
    receive() external payable {}

    /// @dev not need in real job
    /// This method added only because the OpenZepplin Defender marks it as a security issue
    function withdraw(uint256 amount) public {
        require(address(this).balance >= amount, "Insufficient balance in the contract");
        payable(msg.sender).transfer(amount);
    }


    function __OpsReadyMock_init(IOps _ops) public initializer {
        __OpsReady_init(_ops);
    }

    function onlyOpsProtected() onlyOps public {
        onlyOpsProtectedCalledTimes++;
    }

    function payGalatoFee() public {
        _payGalatoFee();
    }

}