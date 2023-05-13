// SPDX-License-Identifier: AGPL-3.0-or-later
pragma solidity ^0.8.0;
import "./ERC4626Upgradeable.sol";

/// @title ERC721 complient Token interface
interface IVaultHook {
    function afterDepositTrigger(ERC4626Upgradeable vault, uint256 assets, uint256 shares) external;
    function beforeWithdrawTrigger(ERC4626Upgradeable vault, uint256 assets, uint256 shares) external;
}