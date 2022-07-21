// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

/// @title Abstract contract by implementation of which 
///  possible to make child contract support of one of keeper providers.
/// @notice This contract is only define interface, 
///  for add support of specific provider need add specific mixin contract.
abstract contract Job {

    /// @notice Method which will be executed by keeper
    function _work() internal virtual;

    /// @notice Method which identify if work can be executed at this moment.
    /// @dev Will be executed by keeper and before `work` method execution.
    /// @return true if `work` method can be called.
    function _canWork() internal virtual view returns (bool);

    // ------------------------------------------ Time check logic ------------------------------------------

    /// @notice Timestamp of last work execution block in seconds.
    /// @dev Logic related to block.timestamp there to allow futher fix logic related timestamp dependency vulnarability.
    ///  Expect all timestamp can be adgasted by minters in a range of 900 seconds.
    /// More info at: https://www.getsecureworld.com/blog/what-is-timestamp-dependence-vulnerability/
    // TODO: find a way to fix this vulnarability. 
    uint256 public lastExecutionTime;

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
 


}