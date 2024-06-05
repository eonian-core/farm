// SPDX-License-Identifier: AGPL-3.0-only
pragma solidity ^0.8.19;

import "forge-std/Test.sol";

import {ERC20Mock} from "./mocks/ERC20Mock.sol";
import {ERC4626LifecycleMock} from "./mocks/ERC4626LifecycleMock.sol";
import {IVaultHookMock} from"./mocks/IVaultHookMock.sol";
import {TestWithERC1820Registry} from "./helpers/TestWithERC1820Registry.sol";

import {IERC20Upgradeable} from "@openzeppelin/contracts-upgradeable/token/ERC20/IERC20Upgradeable.sol";
import {ERC4626Lifecycle} from "contracts/tokens/ERC4626Lifecycle.sol";
import {IVaultHook, ERC4626HookPayload} from "contracts/tokens/IVaultHook.sol";

contract SafeERC4626LifecycleTest is TestWithERC1820Registry {
    ERC20Mock underlying;
    ERC4626LifecycleMock vault;

    address private alice;

    function setUp() public {
        underlying = new ERC20Mock("Mock Token", "TKN");

        address[] memory defaultOperators;
        vault = new ERC4626LifecycleMock(
            IERC20Upgradeable(address(underlying)),
            "Mock Token Vault",
            "vwTKN",
            defaultOperators
        );

        alice = address(0xAAAA);

        vm.label(alice, "alice");
    }

    function invariantMetadata() public {
        assertEq(vault.name(), "Mock Token Vault");
        assertEq(vault.symbol(), "vwTKN");
        assertEq(vault.decimals(), 18);
    }

    function testRegisterAndRunAfterDepositTriggerHook(uint128 depositAmount) public {
        vm.assume(depositAmount > 2);

        //create a hook mock to be able check if the hook was called
        IVaultHookMock hook1 = new IVaultHookMock();
        IVaultHookMock hook2 = new IVaultHookMock();
        vault.registerDepositHook(hook1);
        vault.registerDepositHook(hook2);
        assertEq(hook1.afterDepositHookCalledCounter(), 0);
        assertEq(hook2.afterDepositHookCalledCounter(), 0);

        // Allow the vault to take funds from Alice
        vm.prank(alice);
        underlying.increaseAllowance(address(vault), type(uint256).max);

        // Give the required funds to Alice
        underlying.mint(alice, depositAmount);

        // Check if Alice has the initial balance
        assertEq(underlying.balanceOf(alice), depositAmount);

        // deposit to the vault only half of the funds
        vm.prank(alice);
        vault.deposit(depositAmount / 2);

        assertEq(hook1.afterDepositHookCalledCounter(), 1);
        assertEq(hook2.afterDepositHookCalledCounter(), 1);

        // unregister hook2 to check if it wasn't called second time
        vault.unregisterDepositHook(hook2);

        // deposit to the vault the second half of the funds
        vm.prank(alice);
        vault.deposit(depositAmount / 2);

        assertEq(hook1.afterDepositHookCalledCounter(), 2);
        assertEq(hook2.afterDepositHookCalledCounter(), 1);
    }

}
