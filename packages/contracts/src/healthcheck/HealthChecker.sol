// SPDX-License-Identifier: GNU AGPLv3
pragma solidity ^0.8.26;

import {OwnableUpgradeable} from "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";

import {IHealthCheck, ACCEPTABLE_LOSS, SIGNIFICANT_LOSS} from "./IHealthCheck.sol";
import {SafeInitializable} from "../upgradeable/SafeInitializable.sol";

error HealthCheckFailed();

abstract contract HealthChecker is SafeInitializable, OwnableUpgradeable {
    event HealthCheckChanged(address healthCheck);
    event HealthCheckEnabledChanged(bool enabled);
    event HealthCheckTriggered(uint8 result);

    // represents 100%
    uint256 public constant MAX_BPS = 10_000;

    IHealthCheck public healthCheck;
    bool public healthCheckEnabled;

    /**
     * @dev This empty reserved space is put in place to allow future versions to add new
     * variables without shifting down storage in the inheritance chain.
     * See https://docs.openzeppelin.com/contracts/4.x/upgradeable#storage_gaps
     */
    uint256[50] private __gap;

    // ------------------------------------------ Constructors ------------------------------------------

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
        uint256 totalDebt,
        uint256 gasCost
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

        // If no custom health check implementation provided, call default one.
        uint8 checkResult = healthCheck.check(
            strategy,
            profit,
            loss,
            debtPayment,
            debtOutstanding,
            totalDebt,
            gasCost
        );
        emit HealthCheckTriggered(checkResult);

        if(checkResult == SIGNIFICANT_LOSS) { // call fallback if loss to big
            healthCheckFailedFallback();
        } else if(checkResult == ACCEPTABLE_LOSS) { // call secondary fallback if loss is acceptable
            acceptableLossFallback();
        }
        // just allow to run normally in case of transaction is profitable
    }

    /// @dev Fallback function that is called when the health check fails.
    function healthCheckFailedFallback() internal virtual {
        revert HealthCheckFailed();
    }

    /// @dev Fallback function that is called when the health check fails but loss is acceptable.
    /* solhint-disable no-empty-blocks */
    function acceptableLossFallback() internal virtual {
        // do nothing by default but can be overridden
    }
    /* solhint-disable no-empty-blocks */
}
