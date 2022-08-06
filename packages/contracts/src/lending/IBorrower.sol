// SPDX-License-Identifier: GPL-3.0-only
pragma solidity ^0.8.0;

interface IBorrower {
    function maintainOutstandingDebt(uint256 outstandingDebt) external;
}
