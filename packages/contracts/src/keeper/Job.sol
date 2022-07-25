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

    event Worked(address keeper);
    
    error CannotWorkNow(); 

    // ------------------------------------------ Constructors ------------------------------------------
 

    /**
     * @notice Constructor of Job contract.
     * @param _minimumBetweenExecutions - required time which must pass between executions of the job in seconds.
     */
    function __Job_init(uint256 _minimumBetweenExecutions) internal onlyInitializing {
        __Context_init();
        __ReentrancyGuard_init();

        _setMinimumBetweenExecutions(_minimumBetweenExecutions);
        refreshExecutionTime();
    }

    // ------------------------------------------ Time check logic ------------------------------------------

    /// @notice Timestamp of last work execution block in seconds.
    /// @dev Logic related to block.timestamp there to allow futher fix logic related timestamp dependency vulnarability.
    ///  Expect all timestamp can be adgasted by minters in a range of 900 seconds.
    /// More info at: https://www.getsecureworld.com/blog/what-is-timestamp-dependence-vulnerability/
    // TODO: find a way to fix this vulnarability. 
    // TODO: setup it in constructor
    uint256 public lastExecutionTime;

    /// @notice Mininmal time which must pass between executions of the job in seconds.
    /// Must be greater then 900 seconds, or node opperators will be able to manipulate.
    uint256 public minimumBetweenExecutions;

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

    // ------------------------------------------ Public methods  ------------------------------------------

    /// @notice If work can be executed by keeper at this moment returns true
    /// @dev Will be executed by keeper and before `work` method execution.
    function canWork() public view returns (bool) {
        return isTimePassFromLastExecution(minimumBetweenExecutions) && _canWork();
    }

    /// @notice allow execution only if `canWork` return true
    modifier onlyIfCanWork() { 
        if(!canWork()){
            revert CannotWorkNow();
        }

        _;
    }

    /// @notice Important work which will be executed by keeper.
    // TODO: possible do not use nonReentrant if we have isTimePassFromLastExecution check
    function work() public nonReentrant onlyIfCanWork {
        refreshExecutionTime();
        
        _work();
    }

    // ------------------------------------------ Busines methods to override  ------------------------------

    /// @notice Method which will be executed by keeper
    function _work() internal virtual;

    /// @notice Method which identify if work can be executed at this moment.
    /// @dev Will be executed by keeper and before `work` method execution.
    /// @return true if `work` method can be called.
    function _canWork() internal virtual view returns (bool);

}