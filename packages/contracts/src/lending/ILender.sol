// SPDX-License-Identifier: GNU AGPLv3
pragma solidity ^0.8.26;

/// Base contract for lending protocols, can be used for colletaralized and not colletaralized lending.
interface ILender {

    /// @notice Returns the number of tokens the borrower (caller of this function) can take from the lender
    /// @return Available credit as amount of tokens
    function availableCredit() external view returns (uint256);

    /// @notice Returns the outstanding debt that the borrower (caller of this function) must repay
    /// @return Outstanding debt as amount of tokens
    function outstandingDebt() external view returns (uint256);

    /// @notice Returns the amount of funds taken by the borrower (caller of this function).
    /// @return Debt as amount of tokens
    function currentDebt() external view returns (uint256);

    /// @notice Returns the debt ratio of the borrower (caller of this function).
    function currentDebtRatio() external view returns (uint256);

    /// @notice Returns the last report timestamp of the borrower (caller of this function).
    function lastReport() external view returns (uint256);

    /// @notice Returns the activation status of the borrower (caller of this function).
    /// @return "true" if the borrower is active
    function isActivated() external view returns (bool);

    /// @notice Indicates if the vault was shutted down or not.
    /// @return "true" if the contract is paused, and "false" otherwise.
    function paused() external view returns (bool);

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
    /// @param loss a number of tokens by which the borrower's balance has decreased since the last report.
    ///        May include a portion of the outstanding debt that the borrower was unable to repay.
    /// @param debtPayment is the funds that the borrower must release in order to pay off his outstanding debt (if any).
    function reportNegativeDebtManagement(uint256 loss, uint256 debtPayment)
        external;
}
