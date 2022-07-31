// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import {ReentrancyGuardUpgradeable} from "@openzeppelin/contracts-upgradeable/security/ReentrancyGuardUpgradeable.sol";
import {Initializable} from "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import {ContextUpgradeable} from "@openzeppelin/contracts-upgradeable/utils/ContextUpgradeable.sol";

import "forge-std/console.sol";

/// Someone tried to execute work function while `canWork` is `false`
error CannotWorkNow();

/// Given time minimum between execution must be greater then 1000
error TimeMinimumBetweenExecutionsIncorrect(uint256 _givenTime);

/// @title Abstract contract by implementation of which
///  possible to make child contract support of one of keeper providers.
/// @notice This contract is only define interface,
///  for add support of specific provider need add specific mixin contract.
abstract contract Job is
    Initializable,
    ContextUpgradeable,
    ReentrancyGuardUpgradeable
{
    /// Job work function was executed by worker bot
    event Worked(address indexed worker);

    /// @notice Timestamp of last work execution block in seconds.
    /// @dev Logic of checking and manupulating execution must be only in this contract (not in child)
    ///  to control timestamp dependce vularability.
    /// Important: Expect all timestamp can be adgasted by miners.
    /// More info at: https://www.getsecureworld.com/blog/what-is-timestamp-dependence-vulnerability/
    uint256 public lastWorkTime;

    /// @notice Mininmal time which must pass between executions of the job in seconds.
    /// Better set hours, but at least set to greater then 900 seconds,
    /// node opperators able to manipulate timestamp in 900 seconds range, on some blockchains maybe bigger.
    uint256 public minimumBetweenExecutions;

    // ------------------------------------------ Constructors ------------------------------------------

    /**
     * @notice Constructor of Job contract.
     * @param _minimumBetweenExecutions - required time which must pass between executions of the job in seconds.
     *  Set in hours to prevent block timestamp vularability
     */
    function __Job_init(uint256 _minimumBetweenExecutions)
        internal
        onlyInitializing
    {
        __Context_init();
        __ReentrancyGuard_init();

        _setMinimumBetweenExecutions(_minimumBetweenExecutions);
        // Not will set lastWorkTime to allow first work immediately after contract deploy
    }

    // ------------------------------------------ Public methods  ------------------------------------------

    /// @notice If work can be executed by keeper at this moment returns true
    /// @dev Will be executed by keeper and before `work` method execution.
    function canWork() public view returns (bool) {
        return
            isTimePassFromLastExecution(minimumBetweenExecutions) && _canWork();
    }

    /// @notice allow execution only if `canWork` return true
    modifier onlyWhenCanWork() {
        if (!canWork()) {
            revert CannotWorkNow();
        }

        // refresh execution works like `nonReentrant`
        // if we have `isTimePassFromLastExecution` inside `canWork`
        _refreshLastWorkTime();

        _;
    }

    /// @notice Important work which will be executed by keeper.
    /// @dev possible do not use `nonReentrant` modifier if we have isTimePassFromLastExecution check and refreshLastWorkTime at start
    ///  as it inside `onlyWhenCanWork` modifier.
    ///  But do not delete it, as `canWork` can be overridden.
    ///  Possible to optimize this at the end contact
    function work() public nonReentrant onlyWhenCanWork {
        _work();

        emit Worked(msg.sender);
    }

    // ------------------------------------------ Time check logic ------------------------------------------

    /// @notice Set minimum time between executions.
    /// @param time - required time which must pass between executions of the job in seconds.
    /// Set in hours to prevent block timestamp vulnerability
    function _setMinimumBetweenExecutions(uint256 time) internal {
        if (time <= 1000) {
            revert TimeMinimumBetweenExecutionsIncorrect(time);
        }

        minimumBetweenExecutions = time;
    }

    /// @notice Time that passed since the last exection
    /// @return seconds from last execution in a range of 900 seconds
    function timeFromLastExecution() public view returns (uint256) {
        // lastWorkTime will be zero before first execution
        return block.timestamp - lastWorkTime;
    }

    /// @notice Set time of last execution to current block
    function _refreshLastWorkTime() internal {
        lastWorkTime = block.timestamp;
    }

    /// @notice Check if given time from last execution is passed
    /// @param second - amount of time which mast pass from last execution
    /// @return true if enough time pass
    function isTimePassFromLastExecution(uint256 second)
        internal
        view
        returns (bool)
    {
        return timeFromLastExecution() > second;
    }

    // ------------------------------------------ Busines methods to override  ------------------------------

    /// @notice Method which will be executed by keeper
    function _work() internal virtual;

    /// @notice Method which identify if work can be executed at this moment.
    /// @dev Will be executed by keeper and before `work` method execution.
    /// @return true if `work` method can be called.
    function _canWork() internal view virtual returns (bool);
}
