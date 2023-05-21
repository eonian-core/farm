// SPDX-License-Identifier: GPL-3.0-only
pragma solidity >=0.8.0;

import "contracts/healthcheck/HealthChecker.sol";

contract HealthCheckerMock is HealthChecker(false) {
    event HealthCheckPerformed();

    constructor(IHealthCheck healthCheck) initializer {
        __HealthChecker_init(address(healthCheck));
    }

    function performHealthCheckExternal() external {
        performHealthCheck(address(0), 0, 0, 0, 0, 0);
    }
}

contract HealthCheck is IHealthCheck {
    bool success = false;

    function setSuccess(bool _success) external {
        success = _success;
    }

    function check(
        address, /* strategy */
        uint256, /* profit */
        uint256, /* loss */
        uint256, /* debtPayment */
        uint256, /* debtOutstanding */
        uint256 /* totalDebt */
    ) external view override returns (bool) {
        return success;
    }
}
