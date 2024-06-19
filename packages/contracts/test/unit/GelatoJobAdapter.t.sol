// SPDX-License-Identifier: AGPL-3.0-only
pragma solidity >=0.8.10;

import "forge-std/Test.sol";
import "forge-std/console.sol";
import {IERC20Upgradeable} from "@openzeppelin/contracts-upgradeable/token/ERC20/IERC20Upgradeable.sol";

import {GelatoJobAdapterMock} from "./mocks/GelatoJobAdapterMock.sol";
import {TimeMinimumBetweenExecutionsIncorrect, Job, CannotWorkNow} from "contracts/automation/Job.sol";
import {GelatoJobAdapter, PayableWorkNotAllowed, IJob, IPayableJob} from "contracts/automation/GelatoJobAdapter.sol";
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
        
        uint256 _minimumBetweenExecutions = 1001;
        job.initialize(address(ops), _minimumBetweenExecutions, false);

        // set initial time to be greater than _minimumBetweenExecutions
        vm.warp(_minimumBetweenExecutions * 10);
        initialTime = block.timestamp;

        vm.label(alice, "alice");
        vm.label(bob, "bob");
    }

    function testChecker(
        uint96 time,
        bool _canWork,
        bool _isPrepaid
    ) public {
        job.setCanWorkResult(_canWork);
        job.setIsPrepaid(_isPrepaid);

        (bool canExec1, bytes memory execPayload1) = job.checker();

        // before first execution we have last execution time equal 0
        // so anyway enough time is passed
        assertEq(canExec1, _canWork);
        assertEq(
            execPayload1,
            !_canWork ? bytes("") : (
                _isPrepaid 
                ? abi.encodeCall(IJob.work, ()) 
                : abi.encodeCall(IPayableJob.payableWork, ())
            )
        );

        job.refreshLastWorkTime();
        (bool canExec2, bytes memory execPayload2) = job.checker();

        // just executed job, not enough time pass anyway
        assertEq(canExec2, false);
        assertEq(
            execPayload2,
            bytes("Minimum time between executions not passed")
        );

        vm.warp(initialTime + time);
        (bool canExec3, bytes memory execPayload3) = job.checker();

        assertEq(canExec3, time > 1001 && _canWork);
        if(time <= 1001) {
            assertEq(
                execPayload3,
                bytes("Minimum time between executions not passed")
            );
            return;
        }

        assertEq(
            execPayload3,
            !_canWork ? bytes("") : (
                _isPrepaid 
                ? abi.encodeCall(IJob.work, ()) 
                : abi.encodeCall(IPayableJob.payableWork, ())
            )
        );
    }

    function testCanWorkReturnTrueOnlyWhenTimeCame(uint96 _time) public {
        vm.assume(_time > 1001);

        // Prevent arifmetic errors
        uint256 time = _time;

        // Check we in correct state
        assertEq(job.lastWorkTime(), 0);
        assertEq(job.minimumBetweenExecutions(), 1001);

        // _canWork is false + time is true before first work
        (bool _canWork, ) = job.canWork();
        assertFalse(_canWork);

        // _canWork is true + time is true before first work
        job.setCanWorkResult(true);
        (_canWork, ) = job.canWork();
        assertTrue(_canWork);

        // Set current block as last work time
        job.refreshLastWorkTime();
        assertEq(job.lastWorkTime(), initialTime);
        // _canWork is true + time not came
        (_canWork, ) = job.canWork();
        assertFalse(_canWork);

        // _canWork is true + time came
        vm.warp(initialTime + time);
        (_canWork, ) = job.canWork();
        assertTrue(_canWork);

        // _canWork is false + time came
        job.setCanWorkResult(false);
        (_canWork, ) = job.canWork();
        assertFalse(_canWork);

        // _canWork is true + time came
        job.setCanWorkResult(true);
        (_canWork, ) = job.canWork();
        assertTrue(_canWork);

        // _canWork is true + time not came again
        job.setMinimumBetweenExecutions(time + 1);
        assertEq(job.minimumBetweenExecutions(), time + 1);
        (_canWork, ) = job.canWork();
        assertFalse(_canWork);

        // _canWork is true + time not came
        vm.warp(initialTime + time + 1);
        (_canWork, ) = job.canWork();
        assertFalse(_canWork);

        // _canWork is true + time came
        vm.warp(initialTime + time + 2);
        (_canWork, ) = job.canWork();
        assertTrue(_canWork);
    }

    function testWorkCallsRefreshTheTimeout(
        uint96 _minTime,
        uint96 _secondCall,
        uint96 _thirdCall
    ) public {
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
        (bool _canWork, ) = job.canWork();
        assertTrue(_canWork);
        assertEq(job.workMethodCalledCounter(), 0);

        vm.expectEmit(true, true, true, true);
        job.emitWorked(alice);

        vm.prank(alice);
        job.work();

        assertEq(job.workMethodCalledCounter(), 1);
        (_canWork, ) = job.canWork();
        assertFalse(_canWork);
        assertEq(job.lastWorkTime(), initialTime);

        // Will try second call after some time
        vm.warp(initialTime + secondCall);
        (_canWork, ) = job.canWork();
        assertTrue(_canWork);

        vm.expectEmit(true, true, true, true);
        job.emitWorked(alice);

        vm.prank(alice);
        job.work();

        assertEq(job.workMethodCalledCounter(), 2);
        (_canWork, ) = job.canWork();
        assertFalse(_canWork);
        assertEq(job.lastWorkTime(), initialTime + secondCall);

        // Will try third call after some time
        vm.warp(initialTime + secondCall + thirdCall);

        (_canWork, ) = job.canWork();
        assertTrue(_canWork);

        vm.expectEmit(true, true, true, true);
        job.emitWorked(bob);

        vm.prank(bob);
        job.work();

        assertEq(job.workMethodCalledCounter(), 3);
        (_canWork, ) = job.canWork();
        assertFalse(_canWork);
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
        (bool _canWork, ) = job.canWork();
        assertFalse(_canWork);

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
        (bool _canWork, ) = job.canWork();
        assertFalse(_canWork);

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
        (bool success, ) = address(job).call{value: amount}("");
        require(success, "Native transfer failed");

        job.refreshLastWorkTime();

        // Check we in correct state
        assertEq(job.lastWorkTime(), initialTime);
        assertEq(job.minimumBetweenExecutions(), 1001);

        // Reset to initial values
        job.setMinimumBetweenExecutions(time);
        job.setCanWorkResult(true);
        job.setIsPrepaid(false);
        ops.setFeeDetails(amount, BackCombatibleTransfer.ETH);

        vm.warp(initialTime + time + 1);

        (bool _canWork, ) = job.canWork();
        assertTrue(_canWork);
        assertFalse(job.isPrepaid());
        assertEq(job.workMethodCalledCounter(), 0);

        uint256 preBalance = address(job).balance;
        uint256 alicePreBalance = alice.balance;

        vm.expectEmit(true, true, true, true);
        job.emitWorked(address(ops));

        vm.prank(address(ops));
        job.payableWork();

        uint256 postBalance = address(job).balance;

        assertEq(job.workMethodCalledCounter(), 1);
        (_canWork, ) = job.canWork();
        assertFalse(_canWork);
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
        job.setIsPrepaid(false);
        ops.setFeeDetails(amount, address(token));

        vm.warp(initialTime + time + 1);

        (bool _canWork, ) = job.canWork();
        assertTrue(_canWork);
        assertEq(job.workMethodCalledCounter(), 0);

        uint256 preBalance = token.balanceOf(address(job));
        uint256 alicePreBalance = token.balanceOf(alice);

        vm.expectEmit(true, true, true, true);
        job.emitWorked(address(ops));

        vm.prank(address(ops));
        job.payableWork();

        uint256 postBalance = token.balanceOf(address(job));

        assertEq(job.workMethodCalledCounter(), 1);
        (_canWork, ) = job.canWork();
        assertFalse(_canWork);
        assertEq(job.lastWorkTime(), initialTime + time + 1);
        assertEq(postBalance, preBalance - amount);
        assertEq(token.balanceOf(alice), alicePreBalance + amount);
    }

    function testPayableWorkNotAllowedWhenIsPrepaid(
        uint96 _time,
        uint96 _amount
    ) public {
        vm.assume(_time > 1001);
        vm.assume(_amount > 0);

        // Prevent arifmetic errors
        uint256 time = _time;
        uint256 amount = _amount;

        // set initial state
        ops.setFeeDetails(amount, BackCombatibleTransfer.ETH);
        (bool success, ) = address(job).call{value: amount}("");
        require(success, "Native transfer failed");

        job.refreshLastWorkTime();

        // Check we in correct state
        assertEq(job.lastWorkTime(), initialTime);
        assertEq(job.minimumBetweenExecutions(), 1001);

        // Reset to initial values
        job.setMinimumBetweenExecutions(time);
        job.setCanWorkResult(true);
        job.setIsPrepaid(true);
        ops.setFeeDetails(amount, BackCombatibleTransfer.ETH);

        vm.warp(initialTime + time + 1);

        (bool _canWork, ) = job.canWork();
        assertTrue(_canWork);
        assertTrue(job.isPrepaid());
        assertEq(job.workMethodCalledCounter(), 0);
        vm.expectRevert(PayableWorkNotAllowed.selector);

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
        (bool success, ) = address(job).call{value: amount}("");
        require(success, "Native transfer failed");

        job.refreshLastWorkTime();

        // Check we in correct state
        assertEq(job.lastWorkTime(), initialTime);
        assertEq(job.minimumBetweenExecutions(), 1001);

        // Reset to initial values
        job.setMinimumBetweenExecutions(time);
        job.setCanWorkResult(true);
        job.setIsPrepaid(false);
        ops.setFeeDetails(amount, BackCombatibleTransfer.ETH);

        vm.warp(initialTime + time + 1);

        (bool _canWork, ) = job.canWork();
        assertTrue(_canWork);
        assertFalse(job.isPrepaid());
        assertEq(job.workMethodCalledCounter(), 0);

        job.payableWork();
    }
}
