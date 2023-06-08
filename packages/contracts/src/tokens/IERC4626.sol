// SPDX-License-Identifier: AGPL-3.0
pragma solidity ^0.8.19;

import {IERC20Upgradeable} from "@openzeppelin/contracts-upgradeable/token/ERC20/IERC20Upgradeable.sol";

/// @title ERC4626 complient Vault interface
interface IERC4626 {
    /// @notice The underlying token managed by the Vault. Has units defined by the corresponding ERC-20 contract.
    /// Stored as address of the underlying token used for the Vault for accounting, depositing, and withdrawing.
    function asset() external view returns (IERC20Upgradeable);
}
