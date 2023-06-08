// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "forge-std/Test.sol";
import "forge-std/console.sol";

import "contracts/structures/PriceConverter.sol";

import "./mocks/SafeInitializableMock.sol";

contract SafeInitializableTest is Test {

    SafeInitializableImpl mock;

    address alice = vm.addr(10);
    address bob = vm.addr(11);

    function setUp() public {

        vm.label(alice, "Alice");
        vm.label(bob, "Bob");

    }

    function testShouldNotInitializeTwice() public {
        mock = new SafeInitializableImpl(false);
        mock.__SafeInitializableImpl_init();
        vm.expectRevert(
            bytes("Initializable: contract is already initialized")
        );
        mock.__SafeInitializableImpl_init();
    }

    function testShouldNotAllowInitializeWhemDisabled() public {
        mock = new SafeInitializableImpl(true);
        vm.expectRevert(
            bytes("Initializable: contract is already initialized")
        );
        mock.__SafeInitializableImpl_init();
    }

}