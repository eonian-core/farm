// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "forge-std/Test.sol";
import "forge-std/console.sol";

import "contracts/healthcheck/IHealthCheck.sol";
import "contracts/healthcheck/LossRatioHealthCheck.sol";

import "./mocks/LossRatioHealthCheckMock.sol";

contract LossRatioHealthCheckTest is Test {

    address private strategy;
    LossRatioHealthCheckMock private healthCheck;
    uint256 private lossRatio = 1_500;

    function setUp() public {
        healthCheck = new LossRatioHealthCheckMock(lossRatio);
        strategy = vm.addr(1);
    }

    function testSetShutdownLossRatio(uint256 ratio) public {
        vm.assume(ratio < healthCheck.MAX_BPS());
        vm.expectEmit(true, true, true, true);
        healthCheck.emitShutdownLossRatioChanged(ratio);
        healthCheck.setShutdownLossRatio(ratio);
    }

    function testSetShutdownLossRatioFail(uint256 ratio) public {
        vm.assume(ratio > healthCheck.MAX_BPS());
        vm.expectRevert(ExceededMaximumLossRatioValue.selector);
        healthCheck.setShutdownLossRatio(ratio);
    }

    function testCheckPass(uint256 profit, uint256 totalDebt) public {
        uint8 result = healthCheck.check(strategy, profit, 0, 0, 0, totalDebt, 0);
        assertEq(result, PASS);
    }

    function testCheckPassFailed(uint256 profit, uint256 totalDebt) public {
        vm.expectRevert(HealthCheckFailed.selector);
        healthCheck.check(address(0), profit, 0, 0, 0, totalDebt, 0);
    }

    function testCheckAcceptableLoss(uint256 loss, uint256 totalDebt) public {
        vm.assume(totalDebt < 10 ** 24 && loss < 10 ** 24);
        vm.assume(loss > 0 && loss < totalDebt * lossRatio / healthCheck.MAX_BPS());

        uint8 result = healthCheck.check(strategy, 0, loss, 0, 0, totalDebt, 0);
        assertEq(result, ACCEPTABLE_LOSS);
    }

    function testCheckSignificantLoss(uint256 loss, uint256 totalDebt) public {
        vm.assume(totalDebt < 10 ** 24 && loss < 10 ** 24);
        vm.assume(loss > 0 && loss > totalDebt * lossRatio / healthCheck.MAX_BPS());

        uint8 result = healthCheck.check(strategy, 0, loss, 0, 0, totalDebt, 0);
        assertEq(result, SIGNIFICANT_LOSS);
    }
}