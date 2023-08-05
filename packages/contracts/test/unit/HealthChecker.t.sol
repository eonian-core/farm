// SPDX-License-Identifier: AGPL-3.0-only
pragma solidity >=0.8.0;

import "forge-std/Test.sol";

import "./mocks/HealthCheckerMock.sol";

contract HealthCheckerTest is Test {
    HealthCheckerMock private healthChecker;
    HealthCheck private healthCheck;

    address private culprit = vm.addr(3);
    address private strategy = vm.addr(4);

    function setUp() public {
        healthCheck = new HealthCheck();
        healthChecker = new HealthCheckerMock(healthCheck);
    }

    function testShouldBeEnabledByDefault() public {
        assertEq(healthChecker.healthCheckEnabled(), true);
    }

    function testRevertOnSetHealthCheckIfCallerIsNotAnOwner() public {
        vm.expectRevert(bytes("Ownable: caller is not the owner"));

        vm.prank(address(culprit));
        healthChecker.setHealthCheck(address(0));
    }

    function testShouldSetHealthCheck() public {
        assertEq(address(healthChecker.healthCheck()), address(healthCheck));

        healthChecker.setHealthCheck(address(0));

        assertEq(address(healthChecker.healthCheck()), address(0));
    }

    function testRevertOnSetHealthCheckEnabledIfCallerIsNotAnOwner() public {
        vm.expectRevert(bytes("Ownable: caller is not the owner"));

        vm.prank(address(culprit));
        healthChecker.setHealthCheckEnabled(false);
    }

    function testShouldSetHealthCheckEnabled() public {
        assertEq(healthChecker.healthCheckEnabled(), true);

        healthChecker.setHealthCheckEnabled(false);

        assertEq(healthChecker.healthCheckEnabled(), false);
    }

    function testFailShouldNotPerformHealthCheckIfImplementationIsMissing(
        uint256 profit,
        uint256 loss,
        uint256 debtPayment,
        uint256 debtOutstanding,
        uint256 totalDebt,
        uint256 gasCost
    ) public
    {
        healthChecker.setHealthCheck(address(0));
        vm.expectCall(
            address(healthCheck),
            abi.encodeCall(healthCheck.check, (strategy, profit, loss, debtPayment, debtOutstanding, totalDebt, gasCost))
        );
        healthChecker.performHealthCheckExternal(strategy, profit, loss, debtPayment, debtOutstanding, totalDebt, gasCost);
    }

    function testFailShouldNotPerformHealthCheckIfDisabled(
        uint256 profit,
        uint256 loss,
        uint256 debtPayment,
        uint256 debtOutstanding,
        uint256 totalDebt,
        uint256 gasCost
    ) public {
        healthChecker.setHealthCheckEnabled(false);
        vm.expectCall(
            address(healthCheck),
            abi.encodeCall(healthCheck.check, (strategy, profit, loss, debtPayment, debtOutstanding, totalDebt, gasCost))
        );
        healthChecker.performHealthCheckExternal(strategy, profit, loss, debtPayment, debtOutstanding, totalDebt, gasCost);
    }

    function testShouldEnableHealthCheckIfItWasDisabledAfterTheCheck(
        uint256 profit,
        uint256 loss,
        uint256 debtPayment,
        uint256 debtOutstanding,
        uint256 totalDebt,
        uint256 gasCost
    ) public {
        healthChecker.setHealthCheckEnabled(false);
        healthChecker.performHealthCheckExternal(strategy, profit, loss, debtPayment, debtOutstanding, totalDebt, gasCost);
        assertEq(healthChecker.healthCheckEnabled(), true);
    }

    function testShouldPerformHealthCheck(
        uint256 profit,
        uint256 loss,
        uint256 debtPayment,
        uint256 debtOutstanding,
        uint256 totalDebt,
        uint256 gasCost
    ) public {
        healthCheck.setResult(0);

        vm.expectCall(
            address(healthCheck),
            abi.encodeCall(healthCheck.check, (strategy, profit, loss, debtPayment, debtOutstanding, totalDebt, gasCost))
        );
        healthChecker.performHealthCheckExternal(strategy, profit, loss, debtPayment, debtOutstanding, totalDebt, gasCost);
    }

    function testShouldRevertIfHealthCheckIsUnsuccessfu(
        uint256 profit,
        uint256 loss,
        uint256 debtPayment,
        uint256 debtOutstanding,
        uint256 totalDebt,
        uint256 gasCost
    ) public {
        healthCheck.setResult(2);

        vm.expectCall(
            address(healthCheck),
            abi.encodeCall(healthCheck.check, (strategy, profit, loss, debtPayment, debtOutstanding, totalDebt, gasCost))
        );

        vm.expectRevert(HealthCheckFailed.selector);

        healthChecker.performHealthCheckExternal(strategy, profit, loss, debtPayment, debtOutstanding, totalDebt, gasCost);
    }
}
