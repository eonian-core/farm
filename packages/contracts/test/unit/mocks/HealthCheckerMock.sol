// SPDX-License-Identifier: GPL-3.0-only
pragma solidity >=0.8.0;

import "contracts/healthcheck/HealthChecker.sol";

import "./SafeInitializableMock.sol";

contract HealthCheckerMock is HealthChecker, SafeInitializableMock {
    event HealthCheckPerformed();

    constructor(IHealthCheck healthCheck) initializer {
        __HealthChecker_init(address(healthCheck), 1_500);
    }

    function performHealthCheckExternal() external {
        performHealthCheck(address(0), 0, 0, 0, 0, 0, 0);
    }
}

contract HealthCheck is IHealthCheck {
    uint8 private result = 2;

    function setResult(uint8 _result) external {
        result = _result;
    }

    function check(
        address, /* strategy */
        uint256, /* profit */
        uint256, /* loss */
        uint256, /* debtPayment */
        uint256, /* debtOutstanding */
        uint256, /* totalDebt */
        uint256 /*gasCost*/
    ) external view override returns (uint8) {
        return result;
    }
}
