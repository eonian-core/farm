// SPDX-License-Identifier: GNU AGPLv3
pragma solidity ^0.8.26;

import {SafeInitializable} from "../upgradeable/SafeInitializable.sol";
import {IVersionable} from "../upgradeable/IVersionable.sol";
import {IHealthCheck, PASS, ACCEPTABLE_LOSS, SIGNIFICANT_LOSS} from "./IHealthCheck.sol";
import {SafeUUPSUpgradeable} from "../upgradeable/SafeUUPSUpgradeable.sol";

error HealthCheckFailed();
error ExceededMaximumLossRatioValue();

contract LossRatioHealthCheck is SafeUUPSUpgradeable, IHealthCheck {
    event ShutdownLossRatioChanged(uint256 ratio);

    // represents 100%
    uint256 public constant MAX_BPS = 10_000;

    // The ratio of the loss that will used to stop strategy.
    uint256 public shutdownLossRatio;

    /**
 * @dev This empty reserved space is put in place to allow future versions to add new
     * variables without shifting down storage in the inheritance chain.
     * See https://docs.openzeppelin.com/contracts/4.x/upgradeable#storage_gaps
     */
    uint256[50] private __gap;

    // ------------------------------------------ Constructors ------------------------------------------

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor(bool needDisableInitializers) SafeInitializable(needDisableInitializers) {} // solhint-disable-line no-empty-blocks

    function initialize(uint256 _shutdownLossRatio)
        public
        initializer
    {
        __SafeUUPSUpgradeable_init();

        __LossRatioHealthCheck_init_unchained(_shutdownLossRatio);
    }

    function __LossRatioHealthCheck_init_unchained(uint256 _shutdownLossRatio)
        internal
        onlyInitializing
    {
        setShutdownLossRatio(_shutdownLossRatio);
    }

    /// @inheritdoc IVersionable
    function version() external virtual pure override returns (string memory) {
        return "1.0.1";
    }

    /// @notice Sets the ratio of the loss that will used to stop strategy.
    /// @param _shutdownLossRatio represents percents of loss in comparison with total debt.
    /// @dev Emits the "ShutdownLossRatioChanged" event.
    function setShutdownLossRatio(uint256 _shutdownLossRatio) public onlyOwner {
        if (_shutdownLossRatio > MAX_BPS) {
            revert ExceededMaximumLossRatioValue();
        }

        shutdownLossRatio = _shutdownLossRatio;
        emit ShutdownLossRatioChanged(_shutdownLossRatio);
    }

    /// @inheritdoc IHealthCheck
    function check(
        address strategy,
        uint256 profit,
        uint256 loss,
        uint256 /*debtPayment*/,
        uint256 /*debtOutstanding*/,
        uint256 totalDebt,
        uint256 /*gasCost*/
    ) external view returns (uint8)
    {
        // If no target is provided skip the execution.
        if (address(strategy) == address(0)) {
            revert HealthCheckFailed();
        }

        if(profit > 0 || loss == 0) {
            // if strategy profit is positive or zero, then it is healthy, and we need to get this profit
            return PASS;
        } 
        if(loss > 0 && loss <= totalDebt * shutdownLossRatio / MAX_BPS) {
            // if the loss is positive but below the critical loss threshold
            return ACCEPTABLE_LOSS;
        } 
        
        // If the loss is positive and bigger than we can accept mark it as significant, each strategy can handle its own way.
        return  SIGNIFICANT_LOSS;
    }
}