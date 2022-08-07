// SPDX-License-Identifier: GPL-3.0-only
pragma solidity ^0.8.0;

import "./lending/ILender.sol";

interface IVault is ILender {
    /// @notice Returns the current version of this vault contract
    /// @return a version in semantic versioning format
    function version() external pure returns (string memory);
}
