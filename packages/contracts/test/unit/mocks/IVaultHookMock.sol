// SPDX-License-Identifier: AGPL-3.0-only
pragma solidity ^0.8.19;

import {ERC4626Upgradeable} from "contracts/tokens/ERC4626Upgradeable.sol";
import {IVaultHook, ERC4626HookPayload} from "contracts/tokens/IVaultHook.sol";

contract IVaultHookMock is IVaultHook {

    uint256 public afterDepositHookCalledCounter;

    constructor() {
        afterDepositHookCalledCounter = 0;
    }

    function afterDepositTrigger(ERC4626HookPayload memory /*request*/)
            external override
    {
        afterDepositHookCalledCounter++;
    }

}