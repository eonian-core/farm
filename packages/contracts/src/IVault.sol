// SPDX-License-Identifier: GPL-3.0-only
pragma solidity ^0.8.0;

import "./lending/ILender.sol";
import "./tokens/IERC4626.sol";

interface IVault is ILender, IERC4626 {
    /// @notice Returns the current version of this vault contract
    /// @return a version in semantic versioning format
    function version() external pure returns (string memory);

    /// @notice Revokes a strategy from the vault.
    ///         Sets strategy's dept ratio to zero, so that the strategy cannot take funds from the vault.
    /// @param strategy a strategy to revoke.
    function revokeStrategy(address strategy) external;

    /// @notice Indicates if the vault was shutted down or not.
    /// @return "true" if the contract is paused, and "false" otherwise.
    function paused() external view returns (bool);
}
