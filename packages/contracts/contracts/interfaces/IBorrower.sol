// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

interface IBorrower {
    function maintainOutstandingDebt(uint256 outstandingDebt) external;
}
