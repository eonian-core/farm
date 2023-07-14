// SPDX-License-Identifier: AGPL-3.0-only
pragma solidity ^0.8.19;

import {ERC4626Lifecycle} from "contracts/tokens/ERC4626Lifecycle.sol";
import {IVaultHook} from "contracts/tokens/IVaultHook.sol";
import {IERC20Upgradeable} from "@openzeppelin/contracts-upgradeable/token/ERC20/IERC20Upgradeable.sol";
import {SafeInitializableMock} from "./SafeInitializableMock.sol";

contract ERC4626LifecycleMock is ERC4626Lifecycle, SafeInitializableMock {
    constructor(
        IERC20Upgradeable _asset,
        string memory name_,
        string memory symbol_,
        address[] memory defaultOperators_
    ) initializer {
        __ERC4626_init(_asset, name_, symbol_, defaultOperators_);
    }

    function totalAssets() public view override returns (uint256) {
        return asset.balanceOf(address(this));
    }

    function registerDepositHook(IVaultHook hook) public {
        addDepositHook(hook);
    }

    function registerWithdrawHook(IVaultHook hook) public {
        addWithdrawHook(hook);
    }

    function unregisterDepositHook(IVaultHook hook) public {
        removeDepositHook(hook);
    }

    function unregisterWithdrawHook(IVaultHook hook) public {
        removeWithdrawHook(hook);
    }

    function mint(address to, uint256 amount) external {
        _mint(to, amount, "", "", false);
    }
}