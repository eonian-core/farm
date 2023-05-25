// SPDX-License-Identifier: AGPL-3.0-or-later
pragma solidity ^0.8.19;

import {IVaultLifecycle} from "contracts/tokens/IVaultLifecycle.sol";
import {IVaultHook} from "contracts/tokens/IVaultHook.sol";
import {IERC20Upgradeable} from "@openzeppelin/contracts-upgradeable/token/ERC20/IERC20Upgradeable.sol";

contract IVaultLifecycleMock is IVaultLifecycle {
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

    function registerHook(IVaultHook hook) public {
        addHook(hook);
    }

    function unregisterHook(IVaultHook hook) public {
        removeHook(hook);
    }

    function mint(address to, uint256 amount) external {
        _mint(to, amount, "", "", false);
    }
}