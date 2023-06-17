// SPDX-License-Identifier: AGPL-3.0-only
pragma solidity ^0.8.19;

import {ERC4626Upgradeable} from "./ERC4626Upgradeable.sol";

/// @title ERC4626 Vault Token lifecycle hook interface
interface IVaultHook {
    function afterDepositTrigger(ERC4626UpgradeableRequest memory request) external;
    function beforeWithdrawTrigger(ERC4626UpgradeableRequest memory request) external;
}

struct ERC4626UpgradeableRequest {
    /// @dev The amount of assets to be deposited.
    uint256 assets;

    /// @dev The amount of shares to be minted.
    uint256 shares;

    /// @dev The address that initiated the request.
    address requestSender;

    /// @dev The amount of assets the sender is allowed to withdraw.
    uint256 senderMaxWithdraw;

    /// @dev This empty reserved space is put in place to allow future versions to add new
    /// variables without shifting down storage in the inheritance chain.
    /// See https://docs.openzeppelin.com/contracts/4.x/upgradeable#storage_gaps
    uint256[46] gap;
}