// SPDX-License-Identifier: AGPL-3.0-only
pragma solidity >=0.8.19;

import "forge-std/Test.sol";

import {IERC165Upgradeable} from "@openzeppelin/contracts-upgradeable/utils/introspection/IERC165Upgradeable.sol";
import {IERC721Upgradeable} from "@openzeppelin/contracts-upgradeable/token/ERC721/IERC721Upgradeable.sol";
import {IERC721EnumerableUpgradeable} from "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/IERC721EnumerableUpgradeable.sol";

import {TestWithERC1820Registry} from "./helpers/TestWithERC1820Registry.sol";
import {AccessTestHelper} from "./helpers/AccessTestHelper.sol";
import {ERC5484UpgradableMock} from "./mocks/ERC5484UpgradableMock.sol";
import {ERC5484Upgradeable, ERC5484CanNotBeTransferred, ERC5484TokenDoNotExists} from "contracts/tokens/ERC5484Upgradeable.sol";
import {IERC5484} from "contracts/tokens/IERC5484.sol";
import {IERC4626} from "contracts/tokens/IERC4626.sol";

contract ERC5484UpgradeableTest is TestWithERC1820Registry {
    ERC5484UpgradableMock private token;

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
        token = new ERC5484UpgradableMock(
            "SBT Name",
            "SBT",
            IERC5484.BurnAuth.Neither,
            true
        );
        token.grantRole(token.MINTER_ROLE(), address(this));
    }

    function testVaultMetadata() public {
        assertEq(token.symbol(), "SBT");
        assertEq(token.name(), "SBT Name");
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

    function testMintTokenOnceFail(string memory url) public {
        token.safeMint(alice, url);

        token.safeMint(alice, url);

        assertEq(token.totalSupply(), 1);
    }

    function testMintTokenMultipleTimeForSingleUser(string memory url) public {
        token = new ERC5484UpgradableMock(
            "SBT Name",
            "SBT",
            IERC5484.BurnAuth.Neither,
            false
        );
        token.grantRole(token.MINTER_ROLE(), address(this));
        token.safeMint(alice, url);
        token.safeMint(alice, url);
        token.safeMint(alice, url);

        assertEq(token.totalSupply(), 3);
    }

    function testTokenTransferFail(string memory url) public {
        token.safeMint(alice, url);

        vm.prank(alice);
        vm.expectRevert(ERC5484CanNotBeTransferred.selector);

        token.transferFrom(alice, bob, 0);
    }

    function testTokenBurnFailed(string memory url) public {
        token.safeMint(alice, url);

        vm.prank(alice);
        vm.expectRevert(
            abi.encodePacked(
                AccessTestHelper.getErrorMessage(address(this), token.BURNER_ROLE())
            )
        );
        token.burn(0);

        assertEq(token.totalSupply(), 1);
    }

    function testBurnTokenForIssuerOnly(string memory url, bool mintOnce_) public {
        token = new ERC5484UpgradableMock(
            "SBT Name",
            "SBT",
            IERC5484.BurnAuth.IssuerOnly,
            mintOnce_
        );
        token.grantRole(token.MINTER_ROLE(), address(this));
        token.grantRole(token.BURNER_ROLE(), address(this));

        token.safeMint(alice, url);
        assertEq(token.totalSupply(), 1);

        // can be burn only by issuer
        vm.prank(address(this));
        token.burn(0);

        assertEq(token.totalSupply(), 0);
    }

    function testBurnTokenForIssuerOnlyFail(string memory url, bool mintOnce_) public {
        token = new ERC5484UpgradableMock(
            "SBT Name",
            "SBT",
            IERC5484.BurnAuth.IssuerOnly,
            mintOnce_
        );
        token.grantRole(token.MINTER_ROLE(), address(this));

        token.safeMint(alice, url);
        assertEq(token.totalSupply(), 1);

        // can't be burned by owner
        string memory errorMessage = AccessTestHelper.getErrorMessage(address(alice), token.BURNER_ROLE()); // error message have to be generated before the call
        vm.prank(alice);
        vm.expectRevert(abi.encodePacked(errorMessage));

        token.burn(0);
        assertEq(token.totalSupply(), 1);
    }

    function testBurnTokenForOwnerOnly(string memory url, bool mintOnce_) public{
        token = new ERC5484UpgradableMock(
            "SBT Name",
            "SBT",
            IERC5484.BurnAuth.OwnerOnly,
            mintOnce_
        );
        token.grantRole(token.MINTER_ROLE(), address(this));

        token.safeMint(alice, url);
        assertEq(token.totalSupply(), 1);

        // must pass since it can be burn only by owner
        vm.prank(alice);
        token.burn(0);
        assertEq(token.totalSupply(), 0);
    }

    function testBurnTokenForOwnerOnlyFail(string memory url, bool mintOnce_) public{
        token = new ERC5484UpgradableMock(
            "SBT Name",
            "SBT",
            IERC5484.BurnAuth.OwnerOnly,
            mintOnce_
        );
        token.grantRole(token.MINTER_ROLE(), address(this));

        token.safeMint(alice, url);
        assertEq(token.totalSupply(), 1);

        // must fail since it can be burn only by owner
        vm.prank(address(0));
        vm.expectRevert(
            abi.encodePacked(
                AccessTestHelper.getErrorMessage(address(this), token.BURNER_ROLE())
            )
        );
        token.burn(0);
        assertEq(token.totalSupply(), 1);
    }

    function testBurnTokenForOwnerAndIssuerOnly(string memory url, bool mintOnce_) public{
        token = new ERC5484UpgradableMock(
            "SBT Name",
            "SBT",
            IERC5484.BurnAuth.Both,
            mintOnce_
        );
        token.grantRole(token.MINTER_ROLE(), address(this));
        token.grantRole(token.BURNER_ROLE(), address(alice));
        token.grantRole(token.BURNER_ROLE(), address(this));

        token.safeMint(alice, url);
        token.safeMint(bob, url);
        assertEq(token.totalSupply(), 2);

        // must pass since it can be burn by owner
        vm.prank(alice);
        token.burn(0);
        assertEq(token.totalSupply(), 1);

        // must pass since it can be burn by issuer
        vm.prank(address(this));
        token.burn(1);
        assertEq(token.totalSupply(), 0);
    }

    function testSupportsInterface() public {
        assertEq(token.supportsInterface(type(IERC5484).interfaceId), true);
        assertEq(token.supportsInterface(type(IERC721EnumerableUpgradeable).interfaceId), true);
        assertEq(token.supportsInterface(type(IERC721Upgradeable).interfaceId), true);
        assertEq(token.supportsInterface(type(IERC165Upgradeable).interfaceId), true);
        assertEq(token.supportsInterface(type(IERC4626).interfaceId), false);
    }

    function testBurnAuth(string memory url) public {
        token.safeMint(alice, url);
        IERC5484.BurnAuth auth = token.burnAuth(0);
        assertTrue(auth == IERC5484.BurnAuth.Neither);
    }

    function testBurnAuthFail() public {
        vm.expectRevert(ERC5484TokenDoNotExists.selector);
        token.burnAuth(0);
    }
}