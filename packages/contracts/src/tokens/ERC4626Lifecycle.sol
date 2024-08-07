// SPDX-License-Identifier: GNU AGPLv3
pragma solidity ^0.8.26;

import {SafeERC4626Upgradeable} from "./SafeERC4626Upgradeable.sol";
import {ERC4626Upgradeable} from "./ERC4626Upgradeable.sol";
import {IVaultHook, ERC4626HookPayload} from "./IVaultHook.sol";

abstract contract ERC4626Lifecycle is SafeERC4626Upgradeable {
    
    /// @dev deprecated: Not used anymore
    /// Initially this hooks were created to add additional functionality outside of main contract.
    /// But they can also increase gas usage and attack surface.
    IVaultHook[] public withdrawHooks;
    
    /// Currently used by VaultFoundersToken to react on deposit operations.
    /// Getting rid of them requires a much more complex architecture,
    /// but this will be implemented later in future versions in favor of reducing gas usage and attack surface.
    IVaultHook[] public depositHooks;

    /// @dev This empty reserved space is put in place to allow future versions to add new
    /// variables without shifting down storage in the inheritance chain.
    /// See https://docs.openzeppelin.com/contracts/4.x/upgradeable#storage_gaps
    uint256[50] private __gap;

    /// @dev Will be happend when new deposit hook added
    event DepositHookAdded(address hook);

    /// @dev Will be happend when deposit hook removed
    event DepositHookRemoved(address hook);

    /// @dev Adds hook to the list of deposit hooks
    function addDepositHook(IVaultHook hook) internal {
        depositHooks.push(hook);

        emit DepositHookAdded(address(hook));
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

                emit DepositHookRemoved(address(hook));
                return true;
            }
        }
        return false;
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
        // 
        // length of array controlled directly by owner
        // used only by VaultFoundersToken contract,
        // as a result there is no risk of gas limit attack
        for (uint256 i = 0; i < depositHooks.length; i++) {
            IVaultHook hook = depositHooks[i];
            hook.afterDepositTrigger(request);
        }
    }
}