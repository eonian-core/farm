// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "contracts/lending/Lender.sol";
import {console as cnsl} from "hardhat/console.sol";

import "./SafeInitializableMock.sol";

contract LenderMock is Lender, SafeInitializableMock {
    uint256 public balance;

    mapping(address => uint256) public borrowersBalances;

    uint256[] public feesCharges;

    constructor() initializer {
        __Lender_init();
    }

    // ==========================
    // Test methods
    // ==========================
    function increaseBorrowerBalance(address borrower, uint256 amount)
        external
        returns (uint256)
    {
        borrowersBalances[borrower] += amount;
        return borrowersBalances[borrower];
    }

    function decreaseBorrowerBalance(address borrower, uint256 amount)
        external
        returns (uint256)
    {
        borrowersBalances[borrower] -= amount;
        return borrowersBalances[borrower];
    }

    function setBorrowerBalance(address borrower, uint256 amount)
        external
        returns (uint256)
    {
        borrowersBalances[borrower] = amount;
        return borrowersBalances[borrower];
    }

    function setBalance(uint256 amount) external {
        balance = amount;
    }

    function outstandingDebt(address borrower) external view returns (uint256) {
        return _outstandingDebt(borrower);
    }

    function availableCredit(address borrower) external view returns (uint256) {
        return _availableCredit(borrower);
    }

    function addBorrower(address borrower, uint256 ratio) external {
        _registerBorrower(borrower, ratio);
    }

    function borrowerDebtRatio(address borrower)
        external
        view
        returns (uint256)
    {
        return borrowersData[borrower].debtRatio;
    }

    function borrowerDebt(address borrower) external view returns (uint256) {
        return borrowersData[borrower].debt;
    }

    function borrowerLastReportTimestamp(address borrower)
        external
        view
        returns (uint256)
    {
        return borrowersData[borrower].lastReportTimestamp;
    }

    function borrowerActivationTimestamp(address borrower)
        external
        view
        returns (uint256)
    {
        return borrowersData[borrower].activationTimestamp;
    }

    function borrowerBalance(address borrower) external view returns (uint256) {
        return _borrowerFreeAssets(borrower);
    }

    function emitReportEvent(
        address borrower,
        uint256 debtPayment,
        uint256 freeFunds,
        uint256 fundsGiven,
        uint256 fundsTaken,
        uint256 loss
    ) external {
        emit BorrowerDebtManagementReported(
            borrower,
            debtPayment,
            freeFunds,
            fundsGiven,
            fundsTaken,
            loss
        );
    }

    function setBorrowerDept(address borrower, uint256 debt) external {
        totalDebt = totalDebt - borrowersData[borrower].debt + debt;
        borrowersData[borrower].debt = debt;
    }

    function setBorrowerDebtRatio(address borrower, uint256 debtRatio)
        external
    {
        _setBorrowerDebtRatio(borrower, debtRatio);
    }

    function decreaseBorrowerCredibility(address borrower, uint256 loss)
        external
    {
        _decreaseBorrowerCredibility(borrower, loss);
    }

    function pause() external {
        _pause();
    }

    function getFeesCharges() external view returns (uint256) {
        return feesCharges.length;
    }

    // ==========================
    // Overrided/Virtual methods
    // ==========================
    function _transferFundsToBorrower(address borrower, uint256 amount)
        internal
        override
    {
        require(balance >= amount);

        borrowersBalances[borrower] += amount;
        balance -= amount;
    }

    function _takeFundsFromBorrower(address borrower, uint256 amount)
        internal
        override
    {
        require(borrowersBalances[borrower] >= amount);

        borrowersBalances[borrower] -= amount;
        balance += amount;
    }

    function _borrowerFreeAssets(address borrower)
        internal
        view
        override
        returns (uint256)
    {
        return borrowersBalances[borrower];
    }

    function _freeAssets() internal view override returns (uint256) {
        return balance;
    }

    function _chargeFees(uint256 extraFreeFunds)
        internal
        override
        returns (uint256)
    {
        feesCharges.push(extraFreeFunds);
        return extraFreeFunds;
    }

    function _afterPositiveDebtManagementReport(
        uint256 extraFreeFunds,
        uint256 chargedFees
    ) internal override {}

    function _afterNegativeDebtManagementReport(uint256 remainingDebt)
        internal
        override
    {}
}
