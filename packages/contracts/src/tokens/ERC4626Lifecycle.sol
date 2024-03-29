// SPDX-License-Identifier: AGPL-3.0
pragma solidity ^0.8.19;

import {SafeERC4626Upgradeable} from "./SafeERC4626Upgradeable.sol";
import {ERC4626Upgradeable} from "./ERC4626Upgradeable.sol";
import {IVaultHook, ERC4626HookPayload} from "./IVaultHook.sol";

abstract contract ERC4626Lifecycle is SafeERC4626Upgradeable {
    // list of hooks
    IVaultHook[] public withdrawHooks;
    IVaultHook[] public depositHooks;

    /// @dev This empty reserved space is put in place to allow future versions to add new
    /// variables without shifting down storage in the inheritance chain.
    /// See https://docs.openzeppelin.com/contracts/4.x/upgradeable#storage_gaps
    uint256[50] private __gap;

    /// @dev Adds hook to the list of deposit hooks
    function addDepositHook(IVaultHook hook) internal {
        depositHooks.push(hook);
    }

    /// @dev Adds hook to the list of withdraw hooks
    function addWithdrawHook(IVaultHook hook) internal {
        withdrawHooks.push(hook);
    }

    /// @dev Removes hook from the list of deposit hooks
    function removeDepositHook(IVaultHook hook) internal returns (bool) {
        // find hook
        for (uint256 i = 0; i < depositHooks.length; i++)
        {
            if (depositHooks[i] == hook)
            {
                // remove hook
                depositHooks[i] = depositHooks[depositHooks.length - 1];
                depositHooks.pop();
                return true;
            }
        }
        return false;
    }

    /// @dev Removes hook from the list of withdraw hooks
    function removeWithdrawHook(IVaultHook hook) internal returns (bool) {
        // find hook
        for (uint256 i = 0; i < withdrawHooks.length; i++)
        {
            if (withdrawHooks[i] == hook)
            {
                // remove hook
                withdrawHooks[i] = withdrawHooks[withdrawHooks.length - 1];
                withdrawHooks.pop();
                return true;
            }
        }
        return false;
    }

    /// @inheritdoc ERC4626Upgradeable
    function beforeWithdraw(uint256 assets, uint256 shares)
        internal virtual override(ERC4626Upgradeable)
    {
        // if there are no hooks, then return to save gas
        if(withdrawHooks.length == 0) {
            return;
        }
        ERC4626HookPayload memory request = ERC4626HookPayload({
            assets: assets,
            shares: shares,
            requestSender: msg.sender,
            senderMaxWithdraw: maxWithdraw(msg.sender)
        });
        // iterate over hooks and call it
        for (uint256 i = 0; i < withdrawHooks.length; i++)
        {
            IVaultHook hook = withdrawHooks[i];
            hook.beforeWithdrawTrigger(request);
        }
    }

    /// @inheritdoc ERC4626Upgradeable
    function afterDeposit(uint256 assets, uint256 shares)
        internal virtual override(ERC4626Upgradeable)
    {
        // if there are no depositHooks, then return to save gas
        if(depositHooks.length == 0) {
            return;
        }
        ERC4626HookPayload memory request = ERC4626HookPayload({
            assets: assets,
            shares: shares,
            requestSender: msg.sender,
            senderMaxWithdraw: maxWithdraw(msg.sender)
        });
        // iterate over depositHooks and call it
        for (uint256 i = 0; i < depositHooks.length; i++)
        {
            IVaultHook hook = depositHooks[i];
            hook.afterDepositTrigger(request);
        }
    }
}