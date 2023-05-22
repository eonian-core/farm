// SPDX-License-Identifier: GPL-3.0-only
pragma solidity >=0.8.10;

import {SimpleGelatoJob} from "contracts/automation/example/SimpleGelatoJob.sol";

contract GelatoJobAdapterMock is SimpleGelatoJob(false) {
    function emitWorked(address worker) public onlyOwner {
        emit Worked(worker);
    }
}
