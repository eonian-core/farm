// SPDX-License-Identifier: GPL-3.0-only
pragma solidity >=0.8.0;

import "contracts/healthcheck/LossRatioHealthCheck.sol";

import "./SafeInitializableMock.sol";

contract LossRatioHealthCheckMock is LossRatioHealthCheck {
    constructor(uint256 _lossRation) LossRatioHealthCheck(false) {
        initialize(_lossRation);
    }

    function emitShutdownLossRatioChanged(uint256 ratio) public {
        emit ShutdownLossRatioChanged(ratio);
    }

}