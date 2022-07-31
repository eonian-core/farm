// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "./lending/ILender.sol";

interface IVault is ILender {
    /// @notice Returns the current version of this vault contract
    /// @return a verstion in semantic versioning format
    function version() external pure returns (string memory);
}
