// SPDX-License-Identifier: AGPL-3.0-only
pragma solidity >=0.8.10;

import "forge-std/Test.sol";
import "forge-std/console.sol";
import {IERC20Upgradeable} from "@openzeppelin/contracts-upgradeable/token/ERC20/IERC20Upgradeable.sol";

import {GelatoJobAdapterMock} from "./mocks/GelatoJobAdapterMock.sol";
import {TimeMinimumBetweenExecutionsIncorrect, Job, CannotWorkNow} from "contracts/automation/Job.sol";
import {GelatoJobAdapter, PaybleWorkNotAllowed} from "contracts/automation/GelatoJobAdapter.sol";
import {ERC20Mock} from "./mocks/ERC20Mock.sol";
import {BackCombatibleTransfer} from "contracts/automation/gelato/BackCombatibleTransfer.sol";
import {OpsMock} from "./mocks/OpsMock.sol";

contract GelatoJobAdapterTest is Test {

    GelatoJobAdapterMock job;
    ERC20Mock token;
    OpsMock ops;

    address alice = vm.addr(1);
    address bob = vm.addr(2);

    uint256 initialTime;

    // allow sending eth to the test contract
    receive() external payable {}

    function setUp() public {
        token = new ERC20Mock("Mock Token", "TKN");

        ops = new OpsMock();
        ops.setGelato(payable(alice));

        job = new GelatoJobAdapterMock();
        job.__GelatoJobAdapterMock_init(address(ops), 1001, false);

        initialTime = block.timestamp;

        vm.label(alice, "alice");
        vm.label(bob, "bob");
    }

    function testChecker(uint96 time, bool _canWork, bool _isPrepayd) public {

        job.setCanWorkResult(_canWork);
        job.setIsPrepayd(_isPrepayd);

        (bool canExec1, bytes memory execPayload1) = job.checker();

        // before first execution we have last execution time equal 0
        // so anyway enough time is passed
        assertEq(canExec1, _canWork);
        assertEq(execPayload1, abi.encodeWithSelector(
            _isPrepayd ? job.work.selector : job.payableWork.selector
        ));

        job.refreshLastWorkTime();
        (bool canExec2, bytes memory execPayload2) = job.checker();

        // just executed job, not enough time pass anyway
        assertEq(canExec2, false);
        assertEq(execPayload2, abi.encodeWithSelector(
            _isPrepayd ? job.work.selector : job.payableWork.selector
        ));

        vm.warp(initialTime + time);
        (bool canExec3, bytes memory execPayload3) = job.checker();

        assertEq(canExec3, time > 1001 && _canWork);
        assertEq(execPayload3, abi.encodeWithSelector(
            _isPrepayd ? job.work.selector : job.payableWork.selector
        ));

    }

    function testCanWorkReturnTrueOnlyWhenTimeCame(uint96 _time) public {
        vm.assume(_time > 1001);

        // Prevent arifmetic errors
        uint256 time = _time;

        // Check we in correct state
        assertEq(job.lastWorkTime(), 0);
        assertEq(job.minimumBetweenExecutions(), 1001);

        // _canWork is false + time is true before first work
        assertFalse(job.canWork());

        // _canWork is true + time is true before first work
        job.setCanWorkResult(true);
        assertTrue(job.canWork());

        // Set current block as last work time
        job.refreshLastWorkTime();
        assertEq(job.lastWorkTime(), initialTime);
        // _canWork is true + time not came
        assertFalse(job.canWork());
        
        // _canWork is true + time came
        vm.warp(initialTime + time);
        assertTrue(job.canWork());

        // _canWork is false + time came
        job.setCanWorkResult(false);
        assertFalse(job.canWork());

        // _canWork is true + time came
        job.setCanWorkResult(true);
        assertTrue(job.canWork());

        // _canWork is true + time not came again
        job.setMinimumBetweenExecutions(time + 1);
        assertEq(job.minimumBetweenExecutions(), time + 1);
        assertFalse(job.canWork());

        // _canWork is true + time not came
        vm.warp(initialTime + time + 1);
        assertFalse(job.canWork());

        // _canWork is true + time came
        vm.warp(initialTime + time + 2);
        assertTrue(job.canWork());
    }

    function testWorkCallsRefreshTheTimeout(uint96 _minTime, uint96 _secondCall, uint96 _thirdCall) public {
        vm.assume(_minTime > 1001);
        vm.assume(_minTime < block.timestamp);
        vm.assume(_secondCall > _minTime);
        vm.assume(_thirdCall > _minTime);

        // Prevent arifmetic errors
        uint256 minTime = _minTime;
        uint256 secondCall = _secondCall;
        uint256 thirdCall = _thirdCall;

        // Check we in correct state
        assertEq(job.lastWorkTime(), 0);
        assertEq(job.minimumBetweenExecutions(), 1001);

        // Reset to initial values
        job.setMinimumBetweenExecutions(minTime);
        job.setCanWorkResult(true);
        assertEq(job.minimumBetweenExecutions(), minTime);
        assertEq(job.timeFromLastExecution(), block.timestamp);

        // Will try first call immidiatly after deploy
        assertTrue(job.canWork());
        assertEq(job.workMethodCalledCounter(), 0);
        
        vm.expectEmit(true, true, true, true);
        job.emitWorked(alice);
        
        vm.prank(alice);
        job.work();

        assertEq(job.workMethodCalledCounter(), 1);
        assertFalse(job.canWork());
        assertEq(job.lastWorkTime(), initialTime);

        // Will try second call after some time
        vm.warp(initialTime + secondCall);
        assertTrue(job.canWork());
        
        vm.expectEmit(true, true, true, true);
        job.emitWorked(alice);
        
        vm.prank(alice);
        job.work();

        assertEq(job.workMethodCalledCounter(), 2);
        assertFalse(job.canWork());
        assertEq(job.lastWorkTime(), initialTime + secondCall);

        // Will try third call after some time
        vm.warp(initialTime + secondCall + thirdCall);

        assertTrue(job.canWork());

        vm.expectEmit(true, true, true, true);
        job.emitWorked(bob);

        vm.prank(bob);
        job.work();

        assertEq(job.workMethodCalledCounter(), 3);
        assertFalse(job.canWork());
        assertEq(job.lastWorkTime(), initialTime + secondCall + thirdCall);
    }

    function testWorkHaveCheckForCanWork(uint96 _time) public {
        vm.assume(_time > 1001);

        // Prevent arifmetic errors
        uint256 time = _time;

        // Check we in correct state
        assertEq(job.lastWorkTime(), 0);
        assertEq(job.minimumBetweenExecutions(), 1001);

        // Reset to initial values
        job.setMinimumBetweenExecutions(time);
        job.setCanWorkResult(false);

        // _canWork is false + time came
        vm.warp(initialTime + time);
        assertFalse(job.canWork());

        vm.expectRevert(CannotWorkNow.selector);
        job.work();
    }

    function testWorkHaveCheckForCanWorkTime(uint96 _time) public {
        vm.assume(_time > 1001);

        // Prevent arifmetic errors
        uint256 time = _time;

        // Check we in correct state
        assertEq(job.lastWorkTime(), 0);
        assertEq(job.minimumBetweenExecutions(), 1001);

        // Reset to initial values
        job.setMinimumBetweenExecutions(time);
        job.setCanWorkResult(true);

        job.refreshLastWorkTime();

        // _canWork is true + time not came
        vm.warp(initialTime + time - 1);
        assertFalse(job.canWork());

        vm.expectRevert(CannotWorkNow.selector);
        job.work();
    }

    function testPaybleWorkNativeFee(uint96 _time, uint96 _amount) public {
        vm.assume(_time > 1001);
        vm.assume(_amount > 0);

        // Prevent arifmetic errors
        uint256 time = _time;
        uint256 amount = _amount;

        // set initial state
        ops.setFeeDetails(amount, BackCombatibleTransfer.ETH);
        (bool success, ) = address(job).call{ value: amount }("");
        require(success, "Native transfer failed");

        job.refreshLastWorkTime();

        // Check we in correct state
        assertEq(job.lastWorkTime(), initialTime);
        assertEq(job.minimumBetweenExecutions(), 1001);

        // Reset to initial values
        job.setMinimumBetweenExecutions(time);
        job.setCanWorkResult(true);
        job.setIsPrepayd(false);
        ops.setFeeDetails(amount, BackCombatibleTransfer.ETH);

        vm.warp(initialTime + time + 1);

        assertTrue(job.canWork());
        assertFalse(job.isPrepayd());
        assertEq(job.workMethodCalledCounter(), 0);

        uint preBalance = address(job).balance;
        uint alicePreBalance = alice.balance;

        vm.expectEmit(true, true, true, true);
        job.emitWorked(address(ops));
        
        vm.prank(address(ops));
        job.payableWork();

        uint postBalance = address(job).balance;

        assertEq(job.workMethodCalledCounter(), 1);
        assertFalse(job.canWork());
        assertEq(job.lastWorkTime(), initialTime + time + 1);
        assertEq(postBalance, preBalance - amount);
        assertEq(alice.balance, alicePreBalance + amount);
    }

    function testPaybleWorkERC20Fee(uint96 _time, uint96 _amount) public {
        vm.assume(_time > 1001);
        vm.assume(_amount > 0);

        // Prevent arifmetic errors
        uint256 time = _time;
        uint256 amount = _amount;

        // set initial state
        token.mint(address(job), amount + 1);

        job.refreshLastWorkTime();

        // Check we in correct state
        assertEq(job.lastWorkTime(), initialTime);
        assertEq(job.minimumBetweenExecutions(), 1001);

        // Reset to initial values
        job.setMinimumBetweenExecutions(time);
        job.setCanWorkResult(true);
        job.setIsPrepayd(false);
        ops.setFeeDetails(amount, address(token));

        vm.warp(initialTime + time + 1);

        assertTrue(job.canWork());
        assertEq(job.workMethodCalledCounter(), 0);

        uint preBalance = token.balanceOf(address(job));
        uint alicePreBalance = token.balanceOf(alice);

        vm.expectEmit(true, true, true, true);
        job.emitWorked(address(ops));
        
        vm.prank(address(ops));
        job.payableWork();
        
        uint postBalance = token.balanceOf(address(job));

        assertEq(job.workMethodCalledCounter(), 1);
        assertFalse(job.canWork());
        assertEq(job.lastWorkTime(), initialTime + time + 1);
        assertEq(postBalance, preBalance - amount);
        assertEq(token.balanceOf(alice), alicePreBalance + amount);
    }

    function testPaybleWorkNotAllowedWhenIsPrepaid(uint96 _time, uint96 _amount) public {
        vm.assume(_time > 1001);
        vm.assume(_amount > 0);

        // Prevent arifmetic errors
        uint256 time = _time;
        uint256 amount = _amount;

        // set initial state
        ops.setFeeDetails(amount, BackCombatibleTransfer.ETH);
        (bool success, ) = address(job).call{ value: amount }("");
        require(success, "Native transfer failed");

        job.refreshLastWorkTime();

        // Check we in correct state
        assertEq(job.lastWorkTime(), initialTime);
        assertEq(job.minimumBetweenExecutions(), 1001);

        // Reset to initial values
        job.setMinimumBetweenExecutions(time);
        job.setCanWorkResult(true);
        job.setIsPrepayd(true);
        ops.setFeeDetails(amount, BackCombatibleTransfer.ETH);

        vm.warp(initialTime + time + 1);

        assertTrue(job.canWork());
        assertTrue(job.isPrepayd());
        assertEq(job.workMethodCalledCounter(), 0);

        vm.expectRevert(PaybleWorkNotAllowed.selector);
        
        vm.prank(address(ops));
        job.payableWork();
    }

    function testFailPaybleWorkNotByOps(uint96 _time, uint96 _amount) public {
        vm.assume(_time > 1001);
        vm.assume(_amount > 0);

        // Prevent arifmetic errors
        uint256 time = _time;
        uint256 amount = _amount;

        // set initial state
        ops.setFeeDetails(amount, BackCombatibleTransfer.ETH);
        (bool success, ) = address(job).call{ value: amount }("");
        require(success, "Native transfer failed");

        job.refreshLastWorkTime();

        // Check we in correct state
        assertEq(job.lastWorkTime(), initialTime);
        assertEq(job.minimumBetweenExecutions(), 1001);

        // Reset to initial values
        job.setMinimumBetweenExecutions(time);
        job.setCanWorkResult(true);
        job.setIsPrepayd(false);
        ops.setFeeDetails(amount, BackCombatibleTransfer.ETH);

        vm.warp(initialTime + time + 1);

        assertTrue(job.canWork());
        assertFalse(job.isPrepayd());
        assertEq(job.workMethodCalledCounter(), 0);

        job.payableWork();
    }

}