// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import {ReentrancyGuardUpgradeable} from "@openzeppelin/contracts-upgradeable/security/ReentrancyGuardUpgradeable.sol";
import {Initializable} from "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import {ContextUpgradeable} from "@openzeppelin/contracts-upgradeable/utils/ContextUpgradeable.sol";

/// @title Abstract contract by implementation of which 
///  possible to make child contract support of one of keeper providers.
/// @notice This contract is only define interface, 
///  for add support of specific provider need add specific mixin contract.
abstract contract Job is Initializable, ContextUpgradeable, ReentrancyGuardUpgradeable {

    /// Job work function was executed by keeper
    event Worked(address keeper);
    
    /// Someone tried to execute work function while `canWork` is `false`
    error CannotWorkNow(); 

    /// @notice Timestamp of last work execution block in seconds.
    /// @dev Logic of checking and manupulating execution must be only in this contract (not in child) 
    ///  to control timestamp dependce vularability.
    /// Important: Expect all timestamp can be adgasted by miners.
    /// More info at: https://www.getsecureworld.com/blog/what-is-timestamp-dependence-vulnerability/
    uint256 public lastExecutionTime;

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
    function __Job_init(uint256 _minimumBetweenExecutions) internal onlyInitializing {
        __Context_init();
        __ReentrancyGuard_init();

        _setMinimumBetweenExecutions(_minimumBetweenExecutions);
        refreshExecutionTime();
    }

    // ------------------------------------------ Public methods  ------------------------------------------

    /// @notice If work can be executed by keeper at this moment returns true
    /// @dev Will be executed by keeper and before `work` method execution.
    function canWork() public view returns (bool) {
        return isTimePassFromLastExecution(minimumBetweenExecutions) && _canWork();
    }

    /// @notice allow execution only if `canWork` return true
    modifier onlyWhenCanWork() { 
        if(!canWork()){
            revert CannotWorkNow();
        }

        _;
    }

    /// @notice Important work which will be executed by keeper.
    /// @dev possible do not use nonReentrant if we have isTimePassFromLastExecution check and refreshExecutionTime at start
    ///  But do not will delete it as `canWork` can be ovverriden.
    ///  Possible to optimize this at the end contact
    function work() public nonReentrant onlyWhenCanWork {
        refreshExecutionTime();
        
        _work();
    }

    // ------------------------------------------ Time check logic ------------------------------------------

    /// @notice Set minimum time between executions.
    /// @param _minimumBetweenExecutions - required time which must pass between executions of the job in seconds.
    /// Set in hours to prevent block timestamp vularability
    function _setMinimumBetweenExecutions(uint256 _minimumBetweenExecutions) private {
        require(_minimumBetweenExecutions > 1000, 'minimumBetweenExecutions must be greater then 1000');

        minimumBetweenExecutions = _minimumBetweenExecutions;
    }

    /// @notice Time which pass from last exection
    /// @return seconds from last execution in a range of 900 seconds
    function timeFromLastExecution() public view returns (uint256) {
        return block.timestamp - lastExecutionTime;
    }

    /// @notice Set time of last execution to current block
    function refreshExecutionTime() internal {
        lastExecutionTime = block.timestamp;
    }

    /// @notice Check if given time from last execution is passed
    /// @param second - amount of time which mast pass from last execution 
    /// @return true if enough time pass
    function isTimePassFromLastExecution(uint256 second) internal view returns (bool){
        return timeFromLastExecution() > second;
    }

    // ------------------------------------------ Busines methods to override  ------------------------------

    /// @notice Method which will be executed by keeper
    function _work() internal virtual;

    /// @notice Method which identify if work can be executed at this moment.
    /// @dev Will be executed by keeper and before `work` method execution.
    /// @return true if `work` method can be called.
    function _canWork() internal virtual view returns (bool);

}