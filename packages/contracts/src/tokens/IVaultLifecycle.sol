// SPDX-License-Identifier: AGPL-3.0-or-later
pragma solidity ^0.8.0;

import "./SafeERC4626Upgradeable.sol";
import "./IVaultHook.sol";

abstract contract IVaultLifecycle is ERC4626Upgradeable {
    // list of hooks
    IVaultHook[] public hooks;

    function addHook(IVaultHook hook) external {
        hooks.push(hook);
    }

    function removeHook(IVaultHook hook) external {
        // find hook
        for (uint256 i = 0; i < hooks.length; i++)
        {
            if (hooks[i] == hook)
            {
                // remove hook
                hooks[i] = hooks[hooks.length - 1];
                hooks.pop();
                return;
            }
        }
    }

    /// @inheritdoc ERC4626Upgradeable
    function beforeWithdraw(uint256 assets, uint256 shares)
        internal virtual override(ERC4626Upgradeable)
    {
        // iterate over hooks and call it
        for (uint256 i = 0; i < hooks.length; i++)
        {
            IVaultHook hook = hooks[i];
            hook.beforeWithdrawTrigger(this, assets, shares);
        }
    }

    /// @inheritdoc ERC4626Upgradeable
    function afterDeposit(uint256 assets, uint256 shares)
        internal virtual override(ERC4626Upgradeable)
    {
        // iterate over hooks and call it
        for (uint256 i = 0; i < hooks.length; i++)
        {
            IVaultHook hook = hooks[i];
            hook.afterDepositTrigger(this, assets, shares);
        }
    }
}