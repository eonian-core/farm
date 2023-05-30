// SPDX-License-Identifier: AGPL-3.0-or-later
pragma solidity ^0.8.19;

import {SafeERC4626Upgradeable} from "./SafeERC4626Upgradeable.sol";
import {ERC4626Upgradeable} from "./ERC4626Upgradeable.sol";
import {IVaultHook, ERC4626UpgradeableRequest} from "./IVaultHook.sol";

abstract contract IVaultLifecycle is SafeERC4626Upgradeable {
    // list of hooks
    IVaultHook[] public withdrawHooks;
    IVaultHook[] public depositHooks;

    /// @dev Adds hook to the list of deposit hooks
    function addDepositHook(IVaultHook hook) internal {
        depositHooks.push(hook);
    }

    /// @dev Adds hook to the list of withdraw hooks
    function addWithdrawHook(IVaultHook hook) internal {
        withdrawHooks.push(hook);
    }

    /// @dev Removes hook from the list of deposit hooks
    function removeDepositHook(IVaultHook hook) internal {
        // find hook
        for (uint256 i = 0; i < depositHooks.length; i++)
        {
            if (depositHooks[i] == hook)
            {
                // remove hook
                depositHooks[i] = depositHooks[depositHooks.length - 1];
                depositHooks.pop();
                return;
            }
        }
    }

    /// @dev Removes hook from the list of withdraw hooks
    function removeWithdrawHook(IVaultHook hook) internal {
        // find hook
        for (uint256 i = 0; i < withdrawHooks.length; i++)
        {
            if (withdrawHooks[i] == hook)
            {
                // remove hook
                withdrawHooks[i] = withdrawHooks[withdrawHooks.length - 1];
                withdrawHooks.pop();
                return;
            }
        }
    }

    /// @inheritdoc ERC4626Upgradeable
    function beforeWithdraw(uint256 assets, uint256 shares)
        internal virtual override(ERC4626Upgradeable)
    {
        // if there are no hooks, then return to save gas
        if(withdrawHooks.length == 0) {
            return;
        }
        uint256[46] memory gap_; // this is needed for future upgrades
        ERC4626UpgradeableRequest memory request = ERC4626UpgradeableRequest({
            assets: assets,
            shares: shares,
            requestSender: msg.sender,
            senderMaxWithdraw: maxWithdraw(msg.sender),
            gap: gap_
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
        uint256[46] memory gap_; // this is needed for future upgrades
        ERC4626UpgradeableRequest memory request = ERC4626UpgradeableRequest({
            assets: assets,
            shares: shares,
            requestSender: msg.sender,
            senderMaxWithdraw: maxWithdraw(msg.sender),
            gap: gap_
        });
        // iterate over depositHooks and call it
        for (uint256 i = 0; i < depositHooks.length; i++)
        {
            IVaultHook hook = depositHooks[i];
            hook.afterDepositTrigger(request);
        }
    }
}