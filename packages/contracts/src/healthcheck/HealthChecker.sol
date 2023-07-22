// SPDX-License-Identifier: AGPL-3.0
pragma solidity ^0.8.19;

import {OwnableUpgradeable} from "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";

import {IHealthCheck} from "./IHealthCheck.sol";
import {SafeInitializable} from "../upgradeable/SafeInitializable.sol";

error HealthCheckFailed();

abstract contract HealthChecker is SafeInitializable, OwnableUpgradeable {
    event HealthCheckChanged(address healthCheck);
    event ShutdownLossRatioChanged(uint256 ratio);
    event HealthCheckEnabledChanged(bool enabled);
    event HealthCheckTriggered(uint8 result);

    // represents 100%
    uint256 public constant MAX_BPS = 10_000;

    IHealthCheck public healthCheck;
    bool public healthCheckEnabled;

    // The ratio of the loss that will used to stop strategy.
    uint public shutdownLossRatio;

    /**
     * @dev This empty reserved space is put in place to allow future versions to add new
     * variables without shifting down storage in the inheritance chain.
     * See https://docs.openzeppelin.com/contracts/4.x/upgradeable#storage_gaps
     */
    uint256[49] private __gap;

    // ------------------------------------------ Constructors ------------------------------------------

    function __HealthChecker_init(address _healthCheck, uint256 _shutdownLossRatio)
        internal
        onlyInitializing
    {
        __Ownable_init();

        __HealthChecker_init_unchained(_healthCheck, _shutdownLossRatio);
    }

    function __HealthChecker_init_unchained(address _healthCheck, uint256 _shutdownLossRatio)
        internal
        onlyInitializing
    {
        setHealthCheck(_healthCheck);
        setHealthCheckEnabled(true);
        setShutdownLossRatio(_shutdownLossRatio);
        setShutdownLossRatio(_shutdownLossRatio);
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

    /// @notice Sets the ratio of the loss that will used to stop strategy.
    /// @param _shutdownLossRatio represents persents of loss in comparison with total debt.
    /// @dev Emits the "ShutdownLossRatioChanged" event.
    function setShutdownLossRatio(uint _shutdownLossRatio) public onlyOwner {
        shutdownLossRatio = _shutdownLossRatio;
        emit ShutdownLossRatioChanged(_shutdownLossRatio);
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
        // There is usually no reason to turn off health checks.
        // But sometimes it may be necessary if we need to call a "report" manually.
        // If this happens, we should turn it on again.
        if (!healthCheckEnabled) {
            setHealthCheckEnabled(true);
            return;
        }

        // If no custom health check implementation provided, call default one.
        uint8 checkResult = 0;
        if (address(healthCheck) == address(0)) {
            checkResult = _defaultCheck(
                strategy,
                profit,
                loss,
                totalDebt
            );
        } else {
            // Perform the health check, to revert the transaction
            checkResult = healthCheck.check(
                strategy,
                profit,
                loss,
                debtPayment,
                debtOutstanding,
                totalDebt,
                gasCost
            );
        }

        if(checkResult == 2) { // call fallback if loss to big
            healthCheckFallback();
        } else if(checkResult == 1) { // call secondary fallback if loss is acceptable
            acceptableLossFallback();
        }
        // just allow to run normally in case of transaction is profitable
    }

    /// @dev Fallback function that is called when the health check fails.
    function healthCheckFallback() internal virtual {
        revert HealthCheckFailed();
    }

    /// @dev Fallback function that is called when the health check fails but loss is acceptable.
    /* solhint-disable no-empty-blocks */
    function acceptableLossFallback() internal virtual {
        // do nothing by default but can be overridden
    }
    /* solhint-disable no-empty-blocks */

    /// @notice Performs the health check by comparing execution strategy parameters. This behavior can be overridden with custom health check implementation.
    /// @param profit The amount of funds that the strategy realised as profit.
    /// @param loss The amount of funds that the strategy realised as loss.
    /// @param totalDebt The total amount of funds borrowed by the strategy from the vault.
    function _defaultCheck(
        address strategy,
        uint256 profit,
        uint256 loss,
        uint256 totalDebt
    ) internal returns (uint8 result)
    {
        // If no target provided skipp the execution.
        if (address(strategy) == address(0)) {
            revert HealthCheckFailed();
        }

        if(profit > 0 || loss == 0) {
            // if stategy profit is positive or zero, then it is healthy and we need to get this profit
            result = 0;
        } else if(loss > 0 && loss <= totalDebt * shutdownLossRatio / MAX_BPS) { //todo verify the condition
            // if loss is positive but below critical loss threshold
            result = 1;
        } else {
            // if loss is positive but still makes sense to run transaction to perform reporting.
            result = 2;
        }

        emit HealthCheckTriggered(result);
        return result;
    }
}
