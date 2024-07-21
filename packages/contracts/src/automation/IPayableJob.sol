// SPDX-License-Identifier: GNU AGPLv3
pragma solidity ^0.8.26;

import {IJob} from "./IJob.sol";

interface IPayableJob is IJob {
    function payableWork() external;
}