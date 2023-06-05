// SPDX-License-Identifier: AGPL-3.0-only
pragma solidity ^0.8.19;

import  "forge-std/Test.sol";

import {TestWithERC1820Registry} from "./helpers/TestWithERC1820Registry.sol";
import {AccessTestHelper} from "./helpers/AccessTestHelper.sol";
import {VaultFounderToken} from "contracts/tokens/VaultFounderToken.sol";
import {VaultFounderTokenMock} from "./mocks/VaultFounderTokenMock.sol";

contract VaultFounderTokenTest is TestWithERC1820Registry {
    VaultFounderToken private token;

    address private rewards = vm.addr(1);
    address private culprit = vm.addr(2);

    address private alice = vm.addr(10);
    address private bob = vm.addr(11);

    function setUp() public {
        vm.label(rewards, "rewards");
        vm.label(culprit, "culprit");

        vm.label(alice, "Alice");
        vm.label(bob, "Bob");

        //create a new instance of Founder token contact before each test run
        token = new VaultFounderTokenMock(address(this));
    }

    function testVaultMetadata() public {
        assertEq(token.symbol(), "EVFT");
        assertEq(token.name(), "Eonian Vault Founder Token");
    }

    function testMintToken() public {
        token.safeMint(alice, "testUrl");
        token.safeMint(bob, "testUrl2");

        assertEq(token.totalSupply(), 2);
        assertEq(token.tokenURI(0), "testUrl");
        assertEq(token.tokenURI(1), "testUrl2");
        assertEq(token.ownerOf(0), alice);
        assertEq(token.ownerOf(1), bob);
    }

    function testMintTokenFail(string memory url) public {
        token.safeMint(alice, url);

        vm.expectRevert("ERC5484: User already has token");
        token.safeMint(alice, url);

        assertEq(token.totalSupply(), 1);
    }

    function testBurnTokenFail(string memory url) public {
        token.safeMint(alice, url);

        vm.prank(alice);
        vm.expectRevert("ERC5484: can't be transferred");

        token.transferFrom(alice, bob, 0);
    }

    function testCreateMoreTokenThanAllowedFail() public {
        token.safeMint(alice, "testUrl");
        token.safeMint(bob, "testUrl");
        token.safeMint(culprit, "testUrl");

        vm.expectRevert("EVFT: max number of tokens");
        token.safeMint(rewards, "testUrl");
    }

    function testNextTokenPrice() public {
        assertEq(token.nextTokenPrice(), 200);
        token.safeMint(alice, "testUrl");
        assertEq(token.nextTokenPrice(), 240);
        token.safeMint(bob, "testUrl2");
        assertEq(token.nextTokenPrice(), 288);
        token.safeMint(culprit, "testUrl3");
        assertEq(token.nextTokenPrice(), 345);
    }

    function testPriceOf() public {
        token.safeMint(alice, "testUrl");
        assertEq(token.priceOf(0), 200);
        token.safeMint(bob, "testUrl2");
        assertEq(token.priceOf(1), 240);
        token.safeMint(culprit, "testUrl3");
        assertEq(token.priceOf(2), 288);
    }

    function testPriceOfFail() public {
        vm.expectRevert("EVFT: Token does not exist");
        token.priceOf(0);
    }

    function testSetTokenURI() public {
        token.safeMint(alice, "testUrl");
        vm.prank(alice);
        token.setTokenURI("testUrl2");
        assertEq(token.tokenURI(0), "testUrl2");
    }

    function testSetTokenURIFail() public {
        token.safeMint(alice, "testUrl");
        vm.expectRevert("ERC721Enumerable: owner index out of bounds");
        token.setTokenURI("testUrl2");
    }

    function testSetTokenMultiplier() public {
        assertEq(token.nextTokenPrice(), 200);
        token.safeMint(alice, "testUrl");
        token.setNextTokenMultiplier(200);
        assertEq(token.nextTokenPrice(), 400);
    }

    function testSetTokenMultiplierFail() public {
        assertEq(token.nextTokenPrice(), 200);
        vm.expectRevert(abi.encodePacked(
            AccessTestHelper.getErrorMessage(address(alice), token.DEFAULT_ADMIN_ROLE())
        ));
        vm.prank(alice);
        token.setNextTokenMultiplier(200);
    }

}
