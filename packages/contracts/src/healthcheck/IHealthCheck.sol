// SPDX-License-Identifier: AGPL-3.0
pragma solidity ^0.8.19;

uint8 constant PASS = 0;
uint8 constant ACCEPTABLE_LOSS = 1;
uint8 constant SIGNIFICANT_LOSS = 2;

interface IHealthCheck {
    /// @notice Checks the overall state of the strategy
    /// @param strategy Address of the strategy to be checked.
    /// @param profit The amount of funds that the strategy realised as profit.
    /// @param loss The amount of funds that the strategy realised as loss.
    /// @param debtPayment The amount of funds that the strategy spent to pay the debt.
    /// @param debtOutstanding Outstanding strategy debt.
    /// @param totalDebt The total amount of funds borrowed by the strategy from the vault.
    /// @param gasCost cost of transaction for strategy
    /// @return The status of a completed health check as enumerated. 0 is strategy is healthy and profitable,
    /// 1 is strategy is healthy but cost of transaction bigger than profit so it shouldn't be collected,
    /// 2 is strategy is unhealthy
    function check(
        address strategy,
        uint256 profit,
        uint256 loss,
        uint256 debtPayment,
        uint256 debtOutstanding,
        uint256 totalDebt,
        uint256 gasCost
    ) external view returns (uint8);
}
