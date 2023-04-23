// SPDX-License-Identifier: GPL-3.0-only
pragma solidity ^0.8.19;

import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";

import "./IHealthCheck.sol";

error HealthCheckFailed();

abstract contract HealthChecker is OwnableUpgradeable {
    event HealthCheckChanged(address);
    event HealthCheckEnabledChanged(bool);

    IHealthCheck public healthCheck;
    bool public healthCheckEnabled;

    /**
     * @dev This empty reserved space is put in place to allow future versions to add new
     * variables without shifting down storage in the inheritance chain.
     * See https://docs.openzeppelin.com/contracts/4.x/upgradeable#storage_gaps
     */
    uint256[50] private __gap;

    function __HealthChecker_init(address _healthCheck)
        internal
        onlyInitializing
    {
        __Ownable_init();

        __HealthChecker_init_unchained(_healthCheck);
    }

    function __HealthChecker_init_unchained(address _healthCheck)
        internal
        onlyInitializing
    {
        setHealthCheck(_healthCheck);
        setHealthCheckEnabled(true);
    }

    /// @notice Sets the health check implementation contract.
    /// @param _healthCheck A new health check contract address.
    /// @dev Emits the "HealthCheckChanged" event.
    function setHealthCheck(address _healthCheck) public onlyOwner {
        healthCheck = IHealthCheck(_healthCheck);
        emit HealthCheckChanged(_healthCheck);
    }

    /// @notice Enables or disables the health check.
    /// @param _healthCheckEnabled If "true" - health check will be disabled.
    /// @dev Emits the "HealthCheckEnabledChanged" event.
    /// Do not disable the health check, unless you need to perform "report" in an emergency.
    function setHealthCheckEnabled(bool _healthCheckEnabled) public onlyOwner {
        healthCheckEnabled = _healthCheckEnabled;
        emit HealthCheckEnabledChanged(_healthCheckEnabled);
    }

    /// @notice Performs the health check by calling external contract.
    /// @param strategy Address of the strategy to be checked.
    /// @param profit The amount of funds that the strategy realised as profit.
    /// @param loss The amount of funds that the strategy realised as loss.
    /// @param debtPayment The amount of funds that the strategy spent to pay the debt.
    /// @param debtOutstanding Outstanding strategy debt.
    /// @param totalDebt The total amount of funds borrowed by the strategy from the vault.
    function performHealthCheck(
        address strategy,
        uint256 profit,
        uint256 loss,
        uint256 debtPayment,
        uint256 debtOutstanding,
        uint256 totalDebt
    ) internal virtual {
        // No health check implementation provided, skip the execution.
        if (address(healthCheck) == address(0)) {
            return;
        }

        // There is usually no reason to turn off health checks.
        // But sometimes it may be necessary if we need to call a "report" manually.
        // If this happens, we should turn it on again.
        if (!healthCheckEnabled) {
            setHealthCheckEnabled(true);
            return;
        }

        // Perform the health check, revert the transaction if unsuccessful.
        bool success = healthCheck.check(
            strategy,
            profit,
            loss,
            debtPayment,
            debtOutstanding,
            totalDebt
        );
        if (!success) {
            revert HealthCheckFailed();
        }
    }
}
