// SPDX-License-Identifier: GNU AGPLv3
pragma solidity ^0.8.26;

interface IJob {
    function canWork() external view returns (bool canExec, bytes memory reason);
    function work() external;
}