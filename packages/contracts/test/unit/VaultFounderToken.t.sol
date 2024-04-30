// SPDX-License-Identifier: AGPL-3.0-only
pragma solidity ^0.8.19;

import  "forge-std/Test.sol";

import {TestWithERC1820Registry} from "./helpers/TestWithERC1820Registry.sol";
import {AccessTestHelper} from "./helpers/AccessTestHelper.sol";
import {VaultFounderToken} from "contracts/tokens/VaultFounderToken.sol";
import {ERC5484CanNotBeTransferred} from "contracts/tokens/ERC5484Upgradeable.sol";
import "./mocks/VaultFounderTokenMock.sol";
import {VaultMock} from "./mocks/VaultMock.sol";
import "./mocks/ERC20Mock.sol";

contract VaultFounderTokenTest is TestWithERC1820Registry {
    VaultFounderTokenMock private token;

    address private rewards = vm.addr(1);
    address private culprit = vm.addr(2);

    address private alice = vm.addr(10);
    address private bob = vm.addr(11);
    address private carl = vm.addr(12);

    function setUp() public {
        vm.label(rewards, "rewards");
        vm.label(culprit, "culprit");

        vm.label(alice, "Alice");
        vm.label(bob, "Bob");
        vm.label(carl, "Carl");

        //create a new instance of Founder token contact before each test run
        token = new VaultFounderTokenMock(3, 12_000, 200, Vault(address(this)));
        token.grantRole(token.BALANCE_UPDATER_ROLE(), address(this));
        token.grantRole(token.MINTER_ROLE(), address(this));
    }

    function testVaultMetadata() public {
        assertEq(token.symbol(), "VFT");
        assertEq(token.name(), "Vault Founder Token");
        assertEq(token.owner(), address(this));
    }

    function testMintToken(uint128 _aliceAmount, uint128 _bobAmount, uint128 _carlAmount) public {
        uint256 aliceAmount = uint256(_aliceAmount);
        uint256 bobAmount = uint256(_bobAmount);
        uint256 carlAmount = uint256(_carlAmount);
        vm.assume(aliceAmount >= 200);
        vm.assume(bobAmount >= aliceAmount * token.nextTokenPriceMultiplier() / token.MAX_BPS());
        vm.assume(carlAmount >= bobAmount * token.nextTokenPriceMultiplier() / token.MAX_BPS());

        token.tryToMint(alice, "testUrl", aliceAmount);
        token.tryToMint(bob, "testUrl2", bobAmount);
        token.tryToMint(carl, "testUrl3", carlAmount);

        assertEq(token.totalSupply(), 3);
        assertEq(token.tokenURI(0), "testUrl");
        assertEq(token.tokenURI(1), "testUrl2");
        assertEq(token.tokenURI(2), "testUrl3");
        assertEq(token.ownerOf(0), alice);
        assertEq(token.ownerOf(1), bob);
        assertEq(token.ownerOf(2), carl);
    }

    function testMintTokenFailWithoutPermission(uint128 _aliceAmount) public {
        uint256 aliceAmount = uint256(_aliceAmount);
        vm.assume(aliceAmount >= 200);

        vm.expectRevert(
            abi.encodePacked(
                AccessTestHelper.getErrorMessage(address(alice), token.MINTER_ROLE())
            )
        );
        vm.prank(alice);
        token.tryToMint(alice, "testUrl", aliceAmount);

        assertEq(token.totalSupply(), 0);
    }


    function testMintTokenFail(uint128 _aliceAmount, uint128 _bobAmount, uint128 _carlAmount) public {
        uint256 aliceAmount = uint256(_aliceAmount);
        uint256 bobAmount = uint256(_bobAmount);
        uint256 carlAmount = uint256(_carlAmount);
        vm.assume(aliceAmount >= 200);
        vm.assume(bobAmount < aliceAmount * token.nextTokenPriceMultiplier() / token.MAX_BPS());
        vm.assume(carlAmount < aliceAmount * token.nextTokenPriceMultiplier() / token.MAX_BPS());

        token.tryToMint(alice, "testUrl", aliceAmount);
        token.tryToMint(bob, "testUrl2", bobAmount);
        token.tryToMint(carl, "testUrl3", carlAmount);

        assertEq(token.totalSupply(), 1);
        assertEq(token.tokenURI(0), "testUrl");
        assertEq(token.ownerOf(0), alice);
    }

    function testBurnTokenFail(string memory url, uint128 aliceAmount) public {
        vm.assume(aliceAmount >= 200);
        token.tryToMint(alice, url, aliceAmount);

        vm.prank(alice);
        vm.expectRevert(ERC5484CanNotBeTransferred.selector);

        token.transferFrom(alice, bob, 0);
    }

    function testCreateMoreTokenThanAllowedFail(uint128 _aliceAmount, uint128 _bobAmount, uint128 _carlAmount) public {
        uint256 aliceAmount = uint256(_aliceAmount);
        uint256 bobAmount = uint256(_bobAmount);
        uint256 carlAmount = uint256(_carlAmount);
        vm.assume(aliceAmount >= 200);
        vm.assume(bobAmount >= aliceAmount * token.nextTokenPriceMultiplier() / token.MAX_BPS());
        vm.assume(carlAmount >= bobAmount * token.nextTokenPriceMultiplier() / token.MAX_BPS());

        token.tryToMint(alice, "testUrl", aliceAmount);
        token.tryToMint(bob, "testUrl2", bobAmount);
        token.tryToMint(carl, "testUrl3", carlAmount);
        token.tryToMint(culprit, "testUrl3", carlAmount);

        assertEq(token.totalSupply(), 3);
        assertEq(token.tokenURI(0), "testUrl");
        assertEq(token.tokenURI(1), "testUrl2");
        assertEq(token.tokenURI(2), "testUrl3");
        assertEq(token.ownerOf(0), alice);
        assertEq(token.ownerOf(1), bob);
        assertEq(token.ownerOf(2), carl);
    }

    function testNextTokenPrice(uint128 _aliceAmount, uint128 _bobAmount, uint128 _carlAmount) public {
        uint256 aliceAmount = uint256(_aliceAmount);
        uint256 bobAmount = uint256(_bobAmount);
        uint256 carlAmount = uint256(_carlAmount);
        vm.assume(aliceAmount >= 200);
        vm.assume(bobAmount >= aliceAmount * token.nextTokenPriceMultiplier() / token.MAX_BPS());
        vm.assume(carlAmount >= bobAmount * token.nextTokenPriceMultiplier() / token.MAX_BPS());

        assertEq(token.nextTokenPrice(), 200);
        
        token.tryToMint(alice, "testUrl", aliceAmount);
        assertEq(token.nextTokenPrice(), aliceAmount * token.nextTokenPriceMultiplier() / token.MAX_BPS());
        
        token.tryToMint(bob, "testUrl2", bobAmount);
        assertEq(token.nextTokenPrice(), bobAmount * token.nextTokenPriceMultiplier() / token.MAX_BPS());
        
        token.tryToMint(culprit, "testUrl3", carlAmount);
        assertEq(token.nextTokenPrice(), carlAmount * token.nextTokenPriceMultiplier() / token.MAX_BPS());
    }

    function testSetTokenURI() public {
        token.tryToMint(alice, "testUrl", 200);
        vm.prank(alice);
        token.setTokenURI("testUrl2");
        assertEq(token.tokenURI(0), "testUrl2");
    }

    function testSetTokenURI2() public {
        token.tryToMint(alice, "testUrl", 200);
        token.setTokenURI("testUrl2", 0);
        assertEq(token.tokenURI(0), "testUrl2");
    }

    function testSetTokenURIFail() public {
        token.tryToMint(alice, "testUrl", 200);
        vm.expectRevert("ERC721Enumerable: owner index out of bounds");
        token.setTokenURI("testUrl2");
    }

    function testSetTokenURI2Fail() public {
        token.tryToMint(alice, "testUrl", 200);
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
        token.tryToMint(alice, "testUrl", 200);
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

        assertEq(address(token.vault()), address(this));
        token.setVault(vault);
        assertEq(address(token.vault()), address(vault));
    }

    function testSetVaultFailWithoutPermissionOnVaultSide() public {
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
        vm.expectRevert(abi.encodePacked(
            string(
                abi.encodePacked(
                    "Ownable: caller is not the owner"
                )
            )
        ));
        vm.prank(alice);
        vault.setFounders(address(token));
    }

    function testSetVaultFailWithoutPermissionOnFounderSide() public {
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

        assertEq(address(token.vault()), address(this));

        vm.expectRevert(abi.encodePacked(
            string(
                abi.encodePacked(
                    "AccessControl: account 0x4cceba2d7d2b4fdce4304d3e09a1fea9fbeb1528 is missing role 0x0000000000000000000000000000000000000000000000000000000000000000"
                )
            )
        ));
        vm.prank(alice);
        token.setVault(vault);
    }

}
