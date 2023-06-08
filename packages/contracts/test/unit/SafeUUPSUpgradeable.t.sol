// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "forge-std/Test.sol";
import "forge-std/console.sol";

import "contracts/structures/PriceConverter.sol";

import "./mocks/SafeUUPSUpgradeableMock.sol";

contract SafeUUPSUpgradeableTest is Test {

    SafeUUPSUpgradeableMock proxy;

    address alice = vm.addr(10);
    address bob = vm.addr(11);

    function setUp() public {
        proxy = new SafeUUPSUpgradeableMock();

        vm.label(alice, "Alice");
        vm.label(bob, "Bob");

        vm.prank(alice);
        proxy.__SafeUUPSUpgradeableMock_init();
    }

    function testShouldNotAuthorizeUpgradeFromNonAuthorizedAddress(address newImplementation) public {
        vm.prank(bob);
        vm.expectRevert(
            bytes("Ownable: caller is not the owner")
        );
        proxy.authorizeUpgrade(newImplementation);
    }

    function testShouldAuthorizeUpgradeFromAuthorizedAddress(address newImplementation) public {
        vm.prank(alice);
        proxy.authorizeUpgrade(newImplementation);
    }

}