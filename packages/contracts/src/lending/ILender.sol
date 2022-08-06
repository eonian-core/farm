// SPDX-License-Identifier: GPL-3.0-only
pragma solidity ^0.8.0;

interface ILender {
    /// @notice Returns the number of tokens the borrower (caller of this function) can take from the lender
    /// @return Available credit as amount of tokens
    function availableCredit() external view returns (uint256);

    /// @notice Returns the outstanding debt that the borrower (caller of this function) must repay
    /// @return Outstanding debt as amount of tokens
    function outstandingDebt() external view returns (uint256);

    /// @notice Reports a positive result of the borrower's debt management.
    ///         Borrower must call this function if he has made any profit
    ///         or/and has a free funds available to repay the outstanding debt (if any).
    /// @param extraFreeFunds an extra amount of free funds borrower's contract has.
    ///                       This reporting amount must be greater than the borrower's outstanding debt.
    /// @param debtPayment is the funds that the borrower must release in order to pay off his outstanding debt (if any).
    function reportPositiveDebtManagement(
        uint256 extraFreeFunds,
        uint256 debtPayment
    ) external;

    /// @notice Reports a negative result of the borrower's debt management.
    ///         The borrower must call this function if he is unable to cover his outstanding debt or if he has incurred any losses.
    /// @param remainingDebt a number of tokens by which the borrower's balance has decreased since the last report.
    ///                      May include a portion of the outstanding debt that the borrower was unable to repay.
    /// @param debtPayment is the funds that the borrower must release in order to pay off his outstanding debt (if any).
    function reportNegativeDebtManagement(
        uint256 remainingDebt,
        uint256 debtPayment
    ) external;
}
