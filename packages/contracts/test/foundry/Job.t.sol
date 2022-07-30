// SPDX-License-Identifier: AGPL-3.0-only
pragma solidity >=0.8.10;

import "forge-std/Test.sol";
import "forge-std/console.sol";
import {IERC20Upgradeable} from "@openzeppelin/contracts-upgradeable/token/ERC20/IERC20Upgradeable.sol";

import {JobMock} from "./mocks/JobMock.sol";
import {TimeMinimumBetweenExecutionsIncorrect, Job, CannotWorkNow} from "contracts/automation/Job.sol";

contract JobTest is Test {

    JobMock job;

    address alice = vm.addr(1);
    address bob = vm.addr(2);

    uint256 initialTime;

    function setUp() public {
        job = new JobMock();
        job.__JobMock_init(1001);

        initialTime = block.timestamp;

        vm.label(alice, "alice");
        vm.label(bob, "bob");
    }

    function testCheckTimeMinimumbBetweenExecutions(uint96 time, bool tryConstructor) public {
        vm.assume(time < 1001);

        // Will use it only if tryConstructor is true
        JobMock newJob = new JobMock();

        vm.expectRevert(
            abi.encodeWithSelector(
                TimeMinimumBetweenExecutionsIncorrect.selector,
                time
            )
        );

        if(tryConstructor) {            
            newJob.__JobMock_init(time);
        } else {
            job.setMinimumBetweenExecutions(time);
        }

    }

    function testCanWorkReturnTrueOnlyWhenTimeCame(uint96 _time) public {
        vm.assume(_time > 1001);

        // Prevent arifmetic errors
        uint256 time = _time;

        // Check we in correct state
        assertEq(job.lastExecutionTime(), 0);
        assertEq(job.minimumBetweenExecutions(), 1001);

        // _canWork is false + time is true before first work
        assertFalse(job.canWork());

        // _canWork is true + time is true before first work
        job.setCanWorkResult(true);
        assertTrue(job.canWork());

        // Set current block as last work time
        job.refreshExecutionTime();
        assertEq(job.lastExecutionTime(), initialTime);
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
        assertEq(job.lastExecutionTime(), 0);
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
        assertEq(job.lastExecutionTime(), initialTime);

        // Will try second call after some time
        vm.warp(initialTime + secondCall);
        assertTrue(job.canWork());
        
        vm.expectEmit(true, true, true, true);
        job.emitWorked(alice);
        
        vm.prank(alice);
        job.work();

        assertEq(job.workMethodCalledCounter(), 2);
        assertFalse(job.canWork());
        assertEq(job.lastExecutionTime(), initialTime + secondCall);

        // Will try third call after some time
        vm.warp(initialTime + secondCall + thirdCall);

        assertTrue(job.canWork());

        vm.expectEmit(true, true, true, true);
        job.emitWorked(bob);

        vm.prank(bob);
        job.work();

        assertEq(job.workMethodCalledCounter(), 3);
        assertFalse(job.canWork());
        assertEq(job.lastExecutionTime(), initialTime + secondCall + thirdCall);
    }

    function testCannotWorkfNotPassEnoughTimeFromStartOfBlockchain(uint96 _minTime) public {
        vm.assume(_minTime >= block.timestamp);

        // Prevent arifmetic errors
        uint256 minTime = _minTime;

        // Check we in correct state
        assertEq(job.lastExecutionTime(), 0);
        assertEq(job.minimumBetweenExecutions(), 1001);

        // Reset to initial values
        job.setMinimumBetweenExecutions(minTime);
        job.setCanWorkResult(true);
        assertEq(job.minimumBetweenExecutions(), minTime);
        assertEq(job.timeFromLastExecution(), block.timestamp);

        // Will try first call immidiatly after deploy
        assertFalse(job.canWork());

        vm.expectRevert(CannotWorkNow.selector);
        job.work();
    }

    function testWorkHaveCheckForCanWork(uint96 _time) public {
        vm.assume(_time > 1001);

        // Prevent arifmetic errors
        uint256 time = _time;

        // Check we in correct state
        assertEq(job.lastExecutionTime(), 0);
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
        assertEq(job.lastExecutionTime(), 0);
        assertEq(job.minimumBetweenExecutions(), 1001);

        // Reset to initial values
        job.setMinimumBetweenExecutions(time);
        job.setCanWorkResult(true);

        job.refreshExecutionTime();

        // _canWork is true + time not came
        vm.warp(initialTime + time - 1);
        assertFalse(job.canWork());

        vm.expectRevert(CannotWorkNow.selector);
        job.work();
    }

}