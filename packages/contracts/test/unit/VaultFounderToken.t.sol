// SPDX-License-Identifier: AGPL-3.0-only
pragma solidity >=0.8.10;

import "forge-std/Test.sol";

import "./helpers/TestWithERC1820Registry.sol";
import "contracts/tokens/VaultFounderToken.sol";
import "./mocks/VaultFounderTokenMock.sol";

contract VaultFounderTokenTest is TestWithERC1820Registry {
    VaultFounderToken token;

    address rewards = vm.addr(1);
    address culprit = vm.addr(2);

    address alice = vm.addr(10);
    address bob = vm.addr(11);

    function setUp() public {
        vm.label(rewards, "rewards");
        vm.label(culprit, "culprit");

        vm.label(alice, "Alice");
        vm.label(bob, "Bob");

        //create a new instance of Founder token contact before each test run
        token = new VaultFounderTokenMock();
    }

    function testVaultMetadata() public {
        assertEq(token.symbol(), "ESBT");
        assertEq(token.name(), "Eonian Soul Bound founder token");
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

        vm.expectRevert("SBTERC721Upgradeable: User already has a token");
        token.safeMint(alice, url);

        assertEq(token.totalSupply(), 1);
    }

    function testBurnTokenFail(string memory url) public {
        token.safeMint(alice, url);

        vm.prank(alice);
        vm.expectRevert("SBTERC721Upgradeable: token is SOUL BOUND");

        token.transferFrom(alice, bob, 0);
    }

    function testCreateMoreTokenThanAllowedFail() public {
        token.safeMint(alice, "testUrl");
        token.safeMint(bob, "testUrl");
        token.safeMint(culprit, "testUrl");

        vm.expectRevert("VaultFounderToken: max number of tokens reached");
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
}
