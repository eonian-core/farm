// SPDX-License-Identifier: AGPL-3.0-or-later
pragma solidity ^0.8.19;

import {ERC4626Upgradeable} from "contracts/tokens/ERC4626Upgradeable.sol";
import {IVaultHook, ERC4626UpgradeableRequest} from "contracts/tokens/IVaultHook.sol";

contract IVaultHookMock is IVaultHook {
    uint256 public beforeWithdrawHookCalledCounter;
    uint256 public afterDepositHookCalledCounter;

    constructor() {
        beforeWithdrawHookCalledCounter = 0;
        afterDepositHookCalledCounter = 0;
    }

    function afterDepositTrigger(ERC4626UpgradeableRequest memory /*request*/)
            external override
    {
        afterDepositHookCalledCounter++;
    }

    function beforeWithdrawTrigger(ERC4626UpgradeableRequest memory /*request*/)
        external override
    {
        beforeWithdrawHookCalledCounter++;
    }
}