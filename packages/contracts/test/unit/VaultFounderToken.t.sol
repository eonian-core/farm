// SPDX-License-Identifier: AGPL-3.0-only
pragma solidity ^0.8.19;

import  "forge-std/Test.sol";

import {TestWithERC1820Registry} from "./helpers/TestWithERC1820Registry.sol";
import {AccessTestHelper} from "./helpers/AccessTestHelper.sol";
import {VaultFounderToken} from "contracts/tokens/VaultFounderToken.sol";
import {VaultFounderTokenMock} from "./mocks/VaultFounderTokenMock.sol";
import {VaultMock} from "./mocks/VaultMock.sol";
import "./mocks/ERC20Mock.sol";

contract VaultFounderTokenTest is TestWithERC1820Registry {
    VaultFounderTokenMock private token;

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
        token = new VaultFounderTokenMock();
        token.grantRole(token.BALANCE_UPDATER_ROLE(), address(this));
        token.grantRole(token.MINTER_ROLE(), address(this));
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
        token.safeMint(rewards, "testUrl");

        assertEq(token.totalSupply(), 3);
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

    function testSetTokenURI() public {
        token.safeMint(alice, "testUrl");
        vm.prank(alice);
        token.setTokenURI("testUrl2");
        assertEq(token.tokenURI(0), "testUrl2");
    }

    function testSetTokenURI2() public {
        token.safeMint(alice, "testUrl");
        token.setTokenURI("testUrl2", 0);
        assertEq(token.tokenURI(0), "testUrl2");
    }

    function testSetTokenURIFail() public {
        token.safeMint(alice, "testUrl");
        vm.expectRevert("ERC721Enumerable: owner index out of bounds");
        token.setTokenURI("testUrl2");
    }

    function testSetTokenURI2Fail() public {
        token.safeMint(alice, "testUrl");
        vm.expectRevert(
            abi.encodePacked(
                AccessTestHelper.getErrorMessage(address(alice), token.DEFAULT_ADMIN_ROLE())
            )
        );
        vm.prank(alice);
        token.setTokenURI("testUrl2", 0);
    }

    function testSetTokenMultiplier() public {
        assertEq(token.nextTokenPrice(), 200);
        token.safeMint(alice, "testUrl");
        token.setNextTokenMultiplier(20_000);
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

    function testSetVault() public {
        ERC20Mock underlying = new ERC20Mock("Mock Token", "TKN");
        uint256 defaultFee = 1000;
        uint256 defaultLPRRate = 10**18;
        uint256 defaultFounderFee = 100;

        VaultMock vault = new VaultMock(
            address(underlying),
            rewards,
            defaultFee,
            defaultLPRRate,
            defaultFounderFee
        );
        vault.setFounders(address(token));
        assertEq(vault.founders(), address(token));
    }

}
