// SPDX-License-Identifier: AGPL-3.0-or-later
pragma solidity ^0.8.19;

struct ERC4626UpgradeableRequest2 {
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