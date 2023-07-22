// SPDX-License-Identifier: AGPL-3.0-only
pragma solidity >=0.8.0;

import "forge-std/Test.sol";

import "./mocks/HealthCheckerMock.sol";

contract HealthCheckerTest is Test {
    HealthCheckerMock healthChecker;
    HealthCheck healthCheck;

    address culprit = vm.addr(3);

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

    function testFailShouldNotPerformHealthCheckIfImplementationIsMissing()
        public
    {
        healthChecker.setHealthCheck(address(0));
        vm.expectCall(
            address(healthCheck),
            abi.encodeCall(healthCheck.check, (address(0), 0, 0, 0, 0, 0, 0))
        );
        healthChecker.performHealthCheckExternal();
    }

    function testFailShouldNotPerformHealthCheckIfDisabled() public {
        healthChecker.setHealthCheckEnabled(false);
        vm.expectCall(
            address(healthCheck),
            abi.encodeCall(healthCheck.check, (address(0), 0, 0, 0, 0, 0, 0))
        );
        healthChecker.performHealthCheckExternal();
    }

    function testShouldEnableHealthCheckIfItWasDisabledAfterTheCheck() public {
        healthChecker.setHealthCheckEnabled(false);
        healthChecker.performHealthCheckExternal();
        assertEq(healthChecker.healthCheckEnabled(), true);
    }

    function testShouldPerformHealthCheck() public {
        healthCheck.setResult(0);

        vm.expectCall(
            address(healthCheck),
            abi.encodeCall(healthCheck.check, (address(0), 0, 0, 0, 0, 0, 0))
        );
        healthChecker.performHealthCheckExternal();
    }

    function testShouldRevertIfHealthCheckIsUnsuccessful() public {
        healthCheck.setResult(2);

        vm.expectCall(
            address(healthCheck),
            abi.encodeCall(healthCheck.check, (address(0), 0, 0, 0, 0, 0, 0))
        );

        vm.expectRevert(HealthCheckFailed.selector);

        healthChecker.performHealthCheckExternal();
    }
}
