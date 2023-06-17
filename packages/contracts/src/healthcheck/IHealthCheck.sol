// SPDX-License-Identifier: AGPL-3.0
pragma solidity ^0.8.19;

interface IHealthCheck {
    /// @notice Checks the overall state of the strategy
    /// @param strategy Address of the strategy to be checked.
    /// @param profit The amount of funds that the strategy realised as profit.
    /// @param loss The amount of funds that the strategy realised as loss.
    /// @param debtPayment The amount of funds that the strategy spent to pay the debt.
    /// @param debtOutstanding Outstanding strategy debt.
    /// @param totalDebt The total amount of funds borrowed by the strategy from the vault.
    /// @return The status of a completed health check.
    function check(
        address strategy,
        uint256 profit,
        uint256 loss,
        uint256 debtPayment,
        uint256 debtOutstanding,
        uint256 totalDebt
    ) external view returns (bool);
}
