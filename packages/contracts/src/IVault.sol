// SPDX-License-Identifier: GPL-3.0-only
pragma solidity ^0.8.0;

import "./lending/ILender.sol";

interface IVault is ILender {
    /// @notice Returns the current version of this vault contract
    /// @return a version in semantic versioning format
    function version() external pure returns (string memory);

    /// @notice Returns the contract address of the ERC20-compliant underlying vault asset.
    function underlyingAsset() external view returns (address);

    /// @notice Revokes a strategy from the vault.
    ///         Sets strategy's dept ratio to zero, so that the strategy cannot take funds from the vault.
    /// @param strategy a strategy to revoke.
    function revokeStrategy(address strategy) external;
}
