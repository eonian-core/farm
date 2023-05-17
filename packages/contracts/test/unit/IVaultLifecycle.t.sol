// SPDX-License-Identifier: AGPL-3.0-only
pragma solidity >=0.8.10;

import "forge-std/Test.sol";
import {IERC20Upgradeable} from "@openzeppelin/contracts-upgradeable/token/ERC20/IERC20Upgradeable.sol";

import {ERC20Mock} from "./mocks/ERC20Mock.sol";
import {IVaultLifecycleMock} from "./mocks/IVaultLifecycleMock.sol";

import "./helpers/TestWithERC1820Registry.sol";
import "contracts/tokens/IVaultLifecycle.sol";

contract IVaultLifecycleTest is TestWithERC1820Registry {
    ERC20Mock underlying;
    IVaultLifecycle vault;

    address alice;
    address bob;
    address carl;

    function setUp() public {
        underlying = new ERC20Mock("Mock Token", "TKN");

        address[] memory defaultOperators;
        vault = new IVaultLifecycleMock(
            IERC20Upgradeable(address(underlying)),
            "Mock Token Vault",
            "vwTKN",
            defaultOperators
        );

        alice = address(0xAAAA);
        bob = address(0xBBBB);
        carl = address(0xCCCC);

        vm.label(alice, "alice");
        vm.label(bob, "bob");
        vm.label(carl, "carl");
    }

    function invariantMetadata() public {
        assertEq(vault.name(), "Mock Token Vault");
        assertEq(vault.symbol(), "vwTKN");
        assertEq(vault.decimals(), 18);
    }


}
