// SPDX-License-Identifier: AGPL-3.0-only
pragma solidity >=0.8.10;

import "forge-std/Test.sol";
import "forge-std/console.sol";

import {ERC20Mock} from "../mocks/ERC20Mock.sol";
import {BackCombatibleTransfer} from "contracts/automation/gelato/BackCombatibleTransfer.sol";

contract BackCombatibleTransferTest is Test {

    ERC20Mock token;

    address alice = vm.addr(1);
    address bob = vm.addr(2);

    // allow sending eth to the test contract
    receive() external payable {}


    function setUp() public {
        token = new ERC20Mock("Mock Token", "TKN");

        vm.label(alice, "alice");
        vm.label(bob, "bob");
    }

    function testSafeNativeTransferTokens(uint96 amount) public {
        vm.assume(amount > 0);

        uint preBalance = address(this).balance;
        uint alicePreBalance = alice.balance;

        BackCombatibleTransfer.safeNativeTransfer(payable(alice), amount);

        uint postBalance = address(this).balance;

        assertEq(postBalance, preBalance - amount);
        assertEq(alice.balance, alicePreBalance + amount);
    }

    function testFailSafeNativeTransferTokens(uint256 amount) public {
        vm.assume(amount > address(this).balance);

        BackCombatibleTransfer.safeNativeTransfer(payable(alice), amount);
    }

    function testBackCombatibleTransferNativeToken(uint96 amount) public {
        vm.assume(amount > 0);

        uint preBalance = address(this).balance;
        uint alicePreBalance = alice.balance;

        BackCombatibleTransfer.backCombatibleTransfer(payable(alice), BackCombatibleTransfer.ETH, amount);

        uint postBalance = address(this).balance;

        assertEq(postBalance, preBalance - amount);
        assertEq(alice.balance, alicePreBalance + amount);
    }

    function testBackCombatibleTransferERC20Token(uint96 _amount) public {
        vm.assume(_amount > 0);

        uint256 amount = _amount;

        token.mint(address(this), amount + 1);

        uint preBalance = address(this).balance;
        uint alicePreBalance = alice.balance;

        uint tokenPreBalance = token.balanceOf(address(this));
        uint tokenAlicePreBalance = token.balanceOf(alice);

        token.approve(alice, amount);

        BackCombatibleTransfer.backCombatibleTransfer(payable(alice), address(token), amount);

        uint postBalance = address(this).balance;
        uint tokenPostBalance = token.balanceOf(address(this));

        assertEq(postBalance, preBalance);
        assertEq(alice.balance, alicePreBalance);

        assertEq(tokenPostBalance, tokenPreBalance - amount);
        assertEq(token.balanceOf(alice), tokenAlicePreBalance + amount);
    }

}
