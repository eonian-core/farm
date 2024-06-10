// SPDX-License-Identifier: AGPL-3.0
pragma solidity ^0.8.26;

/** 
 * Allow properly identify different versions of the same contract 
 * and track upgrades results 
 * */
interface IVersionable  {
    /// @notice Returns the current version of this contract
    /// @return a version in semantic versioning format
    function version() external pure returns (string memory);
}
