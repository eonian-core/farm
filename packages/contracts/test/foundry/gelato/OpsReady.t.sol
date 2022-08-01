// SPDX-License-Identifier: AGPL-3.0-only
pragma solidity >=0.8.10;

import "forge-std/Test.sol";
import "forge-std/console.sol";

import {ERC20Mock} from "../mocks/ERC20Mock.sol";
import {BackCombatibleTransfer} from "contracts/automation/gelato/BackCombatibleTransfer.sol";
import {OpsMock} from "../mocks/OpsMock.sol";
import {OpsReadyMock} from "../mocks/OpsReadyMock.sol";

contract OpsReadyTest is Test {

    ERC20Mock token;
    OpsMock ops;
    OpsReadyMock opsReady;

    address alice = vm.addr(1);
    address bob = vm.addr(2);

    // allow sending eth to the test contract
    receive() external payable {}

    function setUp() public {
        token = new ERC20Mock("Mock Token", "TKN");

        vm.label(alice, "alice");
        vm.label(bob, "bob");

        ops = new OpsMock();
        ops.setGelato(payable(alice));

        opsReady = new OpsReadyMock();
        opsReady.__OpsReadyMock_init(address(ops));

    }
    
    function testInvariant(address gelato) public {

        OpsMock _ops = new OpsMock();
        _ops.setGelato(payable(gelato));

        OpsReadyMock _opsReady = new OpsReadyMock();
        _opsReady.__OpsReadyMock_init(address(_ops));

        assertEq(_opsReady.gelato(), gelato);
    }

    function testOnlyOpsProtected() public {

        vm.prank(address(ops));
        opsReady.onlyOpsProtected();

        assertEq(opsReady.onlyOpsProtectedCalledTimes(), 1);
    }

    function testFailCallNotByOpsProtected() public {
        opsReady.onlyOpsProtected();
    }

    function testPayGelatoNativeFee(uint96 amount) public {
        vm.assume(amount > 0);

        // set initial state
        ops.setFeeDetails(amount, BackCombatibleTransfer.ETH);
        (bool success, ) = address(opsReady).call{ value: amount }("");
        require(success, "Native transfer failed");

        uint preBalance = address(opsReady).balance;
        uint alicePreBalance = alice.balance;

        opsReady.payGalatoFee();

        uint postBalance = address(opsReady).balance;

        assertEq(postBalance, preBalance - amount);
        assertEq(alice.balance, alicePreBalance + amount);
    }

    function testPayGelatoERC20Fee(uint96 _amount) public {
        vm.assume(_amount > 0);

        // prevent arithmetic error
        uint256 amount = _amount;

        token.mint(address(opsReady), amount + 1);

        ops.setFeeDetails(amount, address(token));

        uint preBalance = token.balanceOf(address(opsReady));
        uint alicePreBalance = token.balanceOf(alice);

        opsReady.payGalatoFee();

        uint postBalance = token.balanceOf(address(opsReady));

        assertEq(postBalance, preBalance - amount);
        assertEq(token.balanceOf(alice), alicePreBalance + amount);
    }


}