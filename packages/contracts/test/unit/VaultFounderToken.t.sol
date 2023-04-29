// SPDX-License-Identifier: AGPL-3.0-only
pragma solidity >=0.8.10;

import "forge-std/Test.sol";

import "./helpers/TestWithERC1820Registry.sol";
import "contracts/tokens/VaultFounderToken.sol";

contract VaultFounderTokenTest is TestWithERC1820Registry {
    VaultFounderToken token;

    address rewards = vm.addr(1);
    address culprit = vm.addr(2);

    address alice = vm.addr(10);
    address bob = vm.addr(11);

    uint256 defaultFee = 1000;
    uint256 defaultLPRRate = 10**18;

    function setUp() public {
        vm.label(rewards, "rewards");
        vm.label(culprit, "culprit");

        vm.label(alice, "Alice");
        vm.label(bob, "Bob");

        //create a new instance of Founder token contact before each test run
        token = new VaultFounderToken();
    }

    function testVaultMetadata() public {
        assertEq(token.symbol(), "ESBT");
        assertEq(token.name(), "Eonian Soul Bound founder token");
    }

    function testMintToken() public {
        token.safeMint(alice, "testUrl");
        token.safeMint(bob, "testUrl2");

        assertEq(token.totalSupply(), 2);
        assertEq(token.ownerOf(0), alice);
        assertEq(token.ownerOf(1), bob);
    }

    function testMintTokenFail(string memory url) public {
        token.safeMint(alice, url);

        vm.expectRevert(UserHasAlreadyOwnToken.selector);
        token.safeMint(alice, url);

        assertEq(token.totalSupply(), 1);
    }
}
