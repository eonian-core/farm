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

        uint256 _minimumBetweenExecutions = 1001;
        job.__JobMock_init(_minimumBetweenExecutions);

        // set initial time to be greater than _minimumBetweenExecutions
        vm.warp(_minimumBetweenExecutions * 10);

        initialTime = block.timestamp;

        vm.label(alice, "alice");
        vm.label(bob, "bob");
    }

    function testCheckTimeMinimumbBetweenExecutions(
        uint96 time,
        bool tryConstructor
    ) public {
        vm.assume(time < 1001);

        // Will use it only if tryConstructor is true
        JobMock newJob = new JobMock();

        vm.expectRevert(
            abi.encodeWithSelector(
                TimeMinimumBetweenExecutionsIncorrect.selector,
                time
            )
        );

        if (tryConstructor) {
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

    function testCannotWorkfNotPassEnoughTimeFromStartOfBlockchain(
        uint96 _minTime
    ) public {
        vm.assume(_minTime > 1000 && _minTime >= block.timestamp);

        // Prevent arifmetic errors
        uint256 minTime = _minTime;

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
        assertFalse(_canWork);

        vm.expectRevert(CannotWorkNow.selector);
        job.work();
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
}
