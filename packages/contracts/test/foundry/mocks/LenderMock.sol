// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "contracts/mixins/Lender.sol";
import {console as cnsl} from "hardhat/console.sol";

contract LenderMock is Lender {
    uint256 public balance;

    mapping(address => uint256) public borrowersBalances;

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

    function borrowerBalance(address borrower) external view returns (uint256) {
        return _borrowerFreeAssets(borrower);
    }

    function emitReportEvent(
        address borrower,
        uint256 debtPayment,
        uint256 freeFunds,
        uint256 fundsGiven,
        uint256 fundsTaken
    ) external {
        emit BorrowerDebtManagementReported(
            borrower = borrower,
            debtPayment = debtPayment,
            freeFunds = freeFunds,
            fundsGiven = fundsGiven,
            fundsTaken = fundsTaken
        );
    }

    function setBorrowerDept(address borrower, uint256 debt) external {
        borrowersData[borrower].debt = debt;
        totalDebt = debt;
    }

    function decreaseBorrowerCredibility(address borrower, uint256 loss)
        external
    {
        _decreaseBorrowerCredibility(borrower, loss);
    }

    function pause() external {
        _pause();
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
}
