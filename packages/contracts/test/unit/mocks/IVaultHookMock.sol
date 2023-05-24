// SPDX-License-Identifier: AGPL-3.0-or-later
pragma solidity ^0.8.0;

import "contracts/tokens/IVaultLifecycle.sol";


contract IVaultHookMock is IVaultHook {
    uint256 public beforeWithdrawHookCalledCounter;
    uint256 public afterDepositHookCalledCounter;

    constructor() {
        beforeWithdrawHookCalledCounter = 0;
        afterDepositHookCalledCounter = 0;
    }

    function afterDepositTrigger(ERC4626Upgradeable vault, uint256 assets, uint256 shares, address user)
        external override
    {
        afterDepositHookCalledCounter++;
    }

    function beforeWithdrawTrigger(ERC4626Upgradeable vault, uint256 assets, uint256 shares, address user)
        external override
    {
        beforeWithdrawHookCalledCounter++;
    }
}