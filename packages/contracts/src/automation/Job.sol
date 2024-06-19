// SPDX-License-Identifier: AGPL-3.0
pragma solidity ^0.8.26;

import {ReentrancyGuardUpgradeable} from "@openzeppelin/contracts-upgradeable/security/ReentrancyGuardUpgradeable.sol";
import {ContextUpgradeable} from "@openzeppelin/contracts-upgradeable/utils/ContextUpgradeable.sol";

import {SafeInitializable} from "../upgradeable/SafeInitializable.sol";
import {IJob} from "./IJob.sol";

/// Someone tried to execute work function while `canWork` is `false`
error CannotWorkNow();

/// Given time minimum between execution must be greater then 1000
error TimeMinimumBetweenExecutionsIncorrect(uint256 _givenTime);

/// @title Abstract contract by implementation of which
///  possible to make child contract support of one of keeper providers.
/// @notice This contract is only define interface,
///  for add support of specific provider need add specific mixin contract.
abstract contract Job is
    SafeInitializable,
    ContextUpgradeable,
    ReentrancyGuardUpgradeable,
    IJob
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

    /**
     * @dev This empty reserved space is put in place to allow future versions to add new
     * variables without shifting down storage in the inheritance chain.
     * See https://docs.openzeppelin.com/contracts/4.x/upgradeable#storage_gaps
     */
    uint256[50] private __gap;

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

        __Job_init_unchained(_minimumBetweenExecutions);
    }

    /**
     * @notice Unchained constructor of Job contract without rest of the contracts init
     * @param _minimumBetweenExecutions - required time which must pass between executions of the job in seconds.
     *  Set in hours to prevent block timestamp vularability
     */
    function __Job_init_unchained(uint256 _minimumBetweenExecutions)
        internal
        onlyInitializing
    {
        _setMinimumBetweenExecutions(_minimumBetweenExecutions);
        // Not will set lastWorkTime to allow first work immediately after contract deploy
    }

    // ------------------------------------------ Public methods  ------------------------------------------

    /// @notice If work can be executed by keeper at this moment returns true
    /// @dev Will be executed by keeper and before `work` method execution.
    function canWork() public view returns (bool canExec, bytes memory reason) {
        // TODO: Check the maximum delay between job executions (?)
        if(isTimePassFromLastExecution(minimumBetweenExecutions) == false) {
            return (false, bytes("Minimum time between executions not passed"));
        }

        // TODO: possible to add check for high gas price 
        // https://docs.gelato.network/web3-services/web3-functions/quick-start/writing-solidity-functions#id-6.-limit-the-gas-price-of-your-execution
        
        return _canWork();
    }

    /// @notice allow execution only if `canWork` return true
    modifier onlyWhenCanWork() {
        (bool canExec, ) = canWork();
        if (!canExec) {
            revert CannotWorkNow();
        }
        _;
    }

    /// @notice A handle that allows the `_doWork` function to be invoked externally by everyone.
    /// Perform a `canWork` check to avoid unnecessary and (maybe) malicious calls.
    /// @dev `nonReentrant` modifier might be excess there, since we have `isTimePassFromLastExecution` check
    /// and `refreshLastWorkTime` at start (see `onlyWhenCanWork` modifier). Let's keep it, as `canWork` can be overridden.
    function work() public nonReentrant onlyWhenCanWork {
        _doWork();
    }

    /// @notice Performs `_work` call and refreshes the last execution time.
    function _doWork() internal {
        // Refresh execution works like `nonReentrant` modifier if we have a `isTimePassFromLastExecution` check inside `canWork`.
        _refreshLastWorkTime();

        // An important work that is meant to be executed by the keeper.
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
        return block.timestamp - lastWorkTime; // solhint-disable-line not-rely-on-time
    }

    /// @notice Set time of last execution to current block
    function _refreshLastWorkTime() internal {
        lastWorkTime = block.timestamp; // solhint-disable-line not-rely-on-time
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
    /// @return canExec - true if `work` method can be called.
    /// @return reason - if `canExec` is false, then reason why work can't be executed.
    function _canWork() internal view virtual returns (bool canExec, bytes memory reason);
}
