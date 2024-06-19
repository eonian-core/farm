/// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import 'contracts/automation/gelato/IOps.sol';

/// Testing implementation of IOps
contract OpsMock is IOps {
    address payable public gelato;

    function setGelato(address payable _gelato) public {
        gelato = _gelato;
    }

    uint256 public fee;
    address public feeToken;

    function setFeeDetails(uint256 _fee, address _feeToken) public {
        fee = _fee;
        feeToken = _feeToken;
    }

    function getFeeDetails() public view returns (uint256, address) {
        return (fee, feeToken);
    }
    function createTask(
        address /*execAddress*/,
        bytes calldata /*execData*/,
        ModuleData calldata /*moduleData*/,
        address /*_feeToken*/
    ) external pure returns (bytes32 taskId) {
        return bytes32(0);
    }

    function cancelTask(bytes32 taskId) external {}

    function exec(
        address taskCreator,
        address execAddress,
        bytes memory execData,
        ModuleData calldata moduleData,
        uint256 txFee,
        address _feeToken,
        bool useTaskTreasuryFunds,
        bool revertOnFailure
    ) external {}

    function setModule(Module[] calldata modules, address[] calldata moduleAddresses) external {}

    function getTaskIdsByUser(address taskCreator) external view returns (bytes32[] memory) {
        return new bytes32[](0);
    }

    function taskTreasury() external view returns (ITaskTreasuryUpgradable) {
        return ITaskTreasuryUpgradable(address(0));
    }

    function getTaskId(
        address taskCreator,
        address execAddress,
        bytes4 execSelector,
        ModuleData memory moduleData,
        address _feeToken
    ) external pure returns (bytes32 taskId) {
        return bytes32(0);
    }

    function getTaskId(
        address taskCreator,
        address execAddress,
        bytes4 execSelector,
        bool useTaskTreasuryFunds,
        address _feeToken,
        bytes32 resolverHash
    ) external pure returns (bytes32) {
        return bytes32(0);
    }
}
