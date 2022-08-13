// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "forge-std/Test.sol";
import "forge-std/console.sol";
import "@openzeppelin/contracts/utils/math/Math.sol";

import "./mocks/LenderMock.sol";
import {CallerIsNotABorrower, BorrowerAlreadyExists, LenderRatioExceeded, FalsePositiveReport, BorrowerDoesNotExist} from "contracts/lending/Lender.sol";

contract LenderTest is Test {
    LenderMock lenderMock;

    uint256 constant MAX_BPS = 10_000;

    address borrowerA = vm.addr(1);
    address borrowerB = vm.addr(2);
    address culprit = vm.addr(3);

    function setUp() public {
        _resetMocks();

        vm.label(borrowerA, "borrower_A");
        vm.label(borrowerB, "borrower_B");
        vm.label(culprit, "culprit");
    }

    function testOutstandingDebtCalculationZeroRatio(
        uint256 lenderBalance,
        uint256 borrowerDebt
    ) public {
        lenderMock.setBalance(lenderBalance);
        lenderMock.addBorrower(borrowerA, 0);
        lenderMock.setBorrowerDept(borrowerA, borrowerDebt);

        uint256 outstandingDebt = lenderMock.outstandingDebt(borrowerA);
        assertEq(outstandingDebt, borrowerDebt);
    }

    function testOutstandingDebtCalculationPaused(
        uint256 lenderBalance,
        uint256 borrowerDebt,
        uint256 borrowerDebtRatio
    ) public {
        vm.assume(borrowerDebtRatio <= MAX_BPS);

        lenderMock.pause();

        lenderMock.setBalance(lenderBalance);
        lenderMock.addBorrower(borrowerA, borrowerDebtRatio);
        lenderMock.setBorrowerDept(borrowerA, borrowerDebt);

        uint256 outstandingDebt = lenderMock.outstandingDebt(borrowerA);
        assertEq(outstandingDebt, borrowerDebt);
    }

    function testOutstandingDebtCalculation(
        uint192 lenderBalance,
        uint192 borrowerDebt,
        uint64 borrowerDebtRatio,
        bool addSecondBorrower
    ) public {
        vm.assume(borrowerDebtRatio > 0 && borrowerDebtRatio <= MAX_BPS);

        lenderMock.setBalance(lenderBalance);

        lenderMock.addBorrower(borrowerA, borrowerDebtRatio);
        lenderMock.setBorrowerDept(borrowerA, borrowerDebt);

        if (addSecondBorrower) {
            lenderMock.addBorrower(borrowerB, MAX_BPS - borrowerDebtRatio);
            lenderMock.setBorrowerDept(borrowerB, borrowerDebt);
        }

        uint256 lenderFunds = uint256(borrowerDebt) + lenderBalance;
        uint256 borrowerDebtLimit = (borrowerDebtRatio * lenderFunds) / MAX_BPS;
        uint256 expected = borrowerDebtLimit >= borrowerDebt
            ? 0
            : borrowerDebt - borrowerDebtLimit;

        uint256 outstandingDebt = lenderMock.outstandingDebt(borrowerA);
        assertEq(outstandingDebt, expected);
    }

    function testSetBorrowerDebtRatioRevertWithBorrowerDoesNotExist(
        uint256 borrowerDebtRatio
    ) public {
        vm.assume(borrowerDebtRatio <= MAX_BPS);

        vm.expectRevert(BorrowerDoesNotExist.selector);

        lenderMock.setBorrowerDebtRatio(borrowerA, borrowerDebtRatio);
    }

    function testSetBorrowerDebtRatioRevertWithExceededRatio(
        uint256 initialBorrowerDebtRatio,
        uint64 borrowerDebtRatio
    ) public {
        vm.assume(initialBorrowerDebtRatio <= MAX_BPS);
        vm.assume(borrowerDebtRatio > MAX_BPS);

        lenderMock.addBorrower(borrowerA, initialBorrowerDebtRatio);

        vm.expectRevert(
            abi.encodeWithSelector(LenderRatioExceeded.selector, MAX_BPS)
        );

        lenderMock.setBorrowerDebtRatio(borrowerA, borrowerDebtRatio);
    }

    function testSetMultipleBorrowersDebtRatioRevertWithExceededRatio(
        uint64 borrowerADebtRatio,
        uint64 borrowerBDebtRatio
    ) public {
        vm.assume(borrowerADebtRatio <= MAX_BPS);
        vm.assume(borrowerBDebtRatio <= MAX_BPS);

        lenderMock.addBorrower(borrowerA, borrowerADebtRatio);
        lenderMock.addBorrower(borrowerB, 0);

        vm.expectRevert(
            abi.encodeWithSelector(
                LenderRatioExceeded.selector,
                MAX_BPS - borrowerADebtRatio
            )
        );

        lenderMock.setBorrowerDebtRatio(
            borrowerB,
            MAX_BPS - borrowerADebtRatio + 1
        );
    }

    function testSetBorrowerDebtRatio(
        uint64 initialBorrowerDebtRatio,
        uint64 borrowerDebtRatio
    ) public {
        vm.assume(initialBorrowerDebtRatio <= MAX_BPS);
        vm.assume(borrowerDebtRatio <= MAX_BPS);

        lenderMock.addBorrower(borrowerA, initialBorrowerDebtRatio);
        assertEq(
            lenderMock.borrowerDebtRatio(borrowerA),
            initialBorrowerDebtRatio
        );

        lenderMock.setBorrowerDebtRatio(borrowerA, borrowerDebtRatio);
        assertEq(lenderMock.borrowerDebtRatio(borrowerA), borrowerDebtRatio);
        assertEq(lenderMock.debtRatio(), borrowerDebtRatio);
    }

    function testSetBorrowerDebtRatioWithMultipleBorrowers(
        uint64 initialBorrowerADebtRatio,
        uint64 initialBorrowerBDebtRatio,
        uint64 borrowerADebtRatio
    ) public {
        uint256 ratioAmount = uint256(initialBorrowerADebtRatio) +
            initialBorrowerBDebtRatio;
        vm.assume(ratioAmount <= MAX_BPS);
        vm.assume(borrowerADebtRatio <= MAX_BPS - ratioAmount);

        lenderMock.addBorrower(borrowerA, initialBorrowerADebtRatio);
        lenderMock.addBorrower(borrowerB, initialBorrowerBDebtRatio);

        assertEq(
            lenderMock.borrowerDebtRatio(borrowerA),
            initialBorrowerADebtRatio
        );

        assertEq(
            lenderMock.borrowerDebtRatio(borrowerB),
            initialBorrowerBDebtRatio
        );

        lenderMock.setBorrowerDebtRatio(borrowerA, borrowerADebtRatio);

        assertEq(lenderMock.borrowerDebtRatio(borrowerA), borrowerADebtRatio);
        assertEq(
            lenderMock.borrowerDebtRatio(borrowerB),
            initialBorrowerBDebtRatio
        );
        assertEq(
            lenderMock.debtRatio(),
            initialBorrowerBDebtRatio + borrowerADebtRatio
        );
    }

    // If there is one borrower with the maximum ratio, the borrower can take the entire balance of the lender
    function testAvailableCreditCalculationMaxRatio(
        uint192 lenderBalance,
        uint192 borrowerDebt
    ) public {
        lenderMock.setBalance(lenderBalance);

        lenderMock.addBorrower(borrowerA, MAX_BPS);
        lenderMock.setBorrowerDept(borrowerA, borrowerDebt);

        uint256 availableCredit = lenderMock.availableCredit(borrowerA);
        assertEq(availableCredit, lenderBalance);
    }

    function testAvailableCreditCalculation(
        uint192 lenderBalance,
        uint64 borrowerRatio
    ) public {
        vm.assume(borrowerRatio <= MAX_BPS);

        lenderMock.setBalance(lenderBalance);

        lenderMock.addBorrower(borrowerA, borrowerRatio);

        uint256 availableCredit = lenderMock.availableCredit(borrowerA);
        assertEq(
            availableCredit,
            (uint256(lenderBalance) * borrowerRatio) / MAX_BPS
        );
    }

    // Suspended lender has no funds for borrowers
    function testAvailableCreditCalculationPaused(
        uint192 lenderBalance,
        uint192 borrowerDebt
    ) public {
        lenderMock.pause();

        lenderMock.setBalance(lenderBalance);

        lenderMock.addBorrower(borrowerA, MAX_BPS);
        lenderMock.setBorrowerDept(borrowerA, borrowerDebt);

        uint256 availableCredit = lenderMock.availableCredit(borrowerA);
        assertEq(availableCredit, 0);
    }

    function testAddingBorrower(uint256 borrowerARatio, uint256 borrowerBRatio)
        public
    {
        // To prevent overflow exceptions
        vm.assume(borrowerARatio <= MAX_BPS);
        vm.assume(borrowerBRatio <= MAX_BPS);

        // Let's make a constraint to divide the whole ratio between two borrowers
        vm.assume(borrowerARatio + borrowerBRatio <= MAX_BPS);

        // Ensure lender doesn't have any given debt
        assertEq(lenderMock.totalDebt(), 0);
        assertEq(lenderMock.debtRatio(), 0);

        // Adding the first borrower
        lenderMock.addBorrower(borrowerA, borrowerARatio);
        assertEq(lenderMock.borrowerDebtRatio(borrowerA), borrowerARatio);
        assertEq(lenderMock.debtRatio(), borrowerARatio);

        // Adding the second borrower
        lenderMock.addBorrower(borrowerB, borrowerBRatio);
        assertEq(lenderMock.borrowerDebtRatio(borrowerB), borrowerBRatio);
        assertEq(lenderMock.debtRatio(), borrowerARatio + borrowerBRatio);

        // Check if the total debt is still 0 because we just registered the borrowers and haven't issued any loans yet.
        assertEq(lenderMock.totalDebt(), 0);
    }

    function testAddingExistingBorrower() public {
        lenderMock.addBorrower(borrowerA, MAX_BPS);

        vm.expectRevert(BorrowerAlreadyExists.selector);

        lenderMock.addBorrower(borrowerA, MAX_BPS);
    }

    function testAddingBorrowerWithExceededRatio(uint256 borrowerRatio) public {
        vm.assume(borrowerRatio > 0 && borrowerRatio <= MAX_BPS);

        lenderMock.addBorrower(borrowerA, borrowerRatio);

        vm.expectRevert(
            abi.encodeWithSelector(
                LenderRatioExceeded.selector,
                MAX_BPS - borrowerRatio
            )
        );

        lenderMock.addBorrower(borrowerB, MAX_BPS);
    }

    // Positive and negative reports should behave the same if a value of 0 is passed
    function testIdempotentZeroReports(uint192 balance, uint32 borrowerRatio)
        public
    {
        vm.assume(borrowerRatio >= 0 && borrowerRatio <= MAX_BPS);

        vm.expectCall(
            address(lenderMock),
            abi.encodeCall(lenderMock.reportPositiveDebtManagement, (0, 0))
        );

        _testInitialBorrowerReport(
            borrowerA,
            balance,
            borrowerRatio,
            lenderMock.reportPositiveDebtManagement
        );

        uint256 positiveLenderDebt = lenderMock.totalDebt();
        uint256 positiveBorrowerDebt = lenderMock.borrowerDebt(borrowerA);

        _resetMocks();

        vm.expectCall(
            address(lenderMock),
            abi.encodeCall(lenderMock.reportNegativeDebtManagement, (0, 0))
        );

        _testInitialBorrowerReport(
            borrowerA,
            balance,
            borrowerRatio,
            lenderMock.reportNegativeDebtManagement
        );

        uint256 negativeLenderDebt = lenderMock.totalDebt();
        uint256 negativeBorrowerDebt = lenderMock.borrowerDebt(borrowerA);

        assertEq(positiveLenderDebt, negativeLenderDebt);
        assertEq(positiveBorrowerDebt, negativeBorrowerDebt);
    }

    // Should revert if the borrower lied about his extra funds
    function testFalsePositiveReport(uint192 balance) public {
        uint256 borrowerRatio = MAX_BPS;

        // "Give" some amount of funds to the lender
        lenderMock.setBalance(balance);
        assertEq(lenderMock.lendingAssets(), balance);

        // Register a new borrower
        lenderMock.addBorrower(borrowerA, borrowerRatio);
        assertEq(lenderMock.totalDebt(), 0);
        assertEq(lenderMock.debtRatio(), borrowerRatio);
        assertEq(lenderMock.borrowerDebtRatio(borrowerA), borrowerRatio);

        vm.prank(borrowerA);
        vm.expectRevert(FalsePositiveReport.selector);

        // Report extra funds that borrower doesn't have
        lenderMock.reportPositiveDebtManagement(1, 0);
    }

    // Should have expected state after positive report
    function testBorrowerPositiveReport(
        uint192 balance,
        uint64 gain,
        uint32 borrowerRatio
    ) public {
        vm.assume(borrowerRatio >= 0 && borrowerRatio <= MAX_BPS);

        // Setup borrower and make an initial report
        _testInitialBorrowerReport(balance, borrowerRatio);

        // Preparing to the second report...
        // Give some of the funds to the borrower (assuming that some time has passed and the borrower has made a profit)
        // NOTE: this function doesn't transfer funds from the lender to the borrower, it simply sets the borrower's balance
        uint256 borrowerBalanceBeforeReport = lenderMock
            .increaseBorrowerBalance(borrowerA, gain);

        // Expect event `BorrowerDebtManagementReported` emitted:
        // `debtPayment`, `fundsTaken` = 0; `freeFunds`, `fundsTaken` = gain
        vm.expectEmit(true, true, true, true);
        lenderMock.emitReportEvent(borrowerA, 0, gain, 0, gain, 0);

        // Let's report this gain on behalf of the borrower
        vm.prank(borrowerA);
        lenderMock.reportPositiveDebtManagement(gain, 0);

        // Since the lender's balance (free assets) and the borrower's debt ratio haven't changed,
        // no additional credit funds are available to the borrower.
        // This means that the lender must take some of the borrower's excess funds for itself.
        uint256 lenderInitialBalance = balance -
            (uint256(balance) * borrowerRatio) /
            MAX_BPS;
        assertEq(lenderMock.balance(), lenderInitialBalance + gain);
        assertEq(
            lenderMock.borrowerBalance(borrowerA),
            borrowerBalanceBeforeReport - gain
        );
    }

    function testBorrowerReportWithWrongCaller() public {
        vm.prank(culprit);
        vm.expectRevert(CallerIsNotABorrower.selector);
        lenderMock.reportNegativeDebtManagement(0, 0);

        vm.prank(culprit);
        vm.expectRevert(CallerIsNotABorrower.selector);
        lenderMock.reportPositiveDebtManagement(0, 0);
    }

    // Should have expected state after negative report
    function testBorrowerNegativeReport(
        uint192 balance,
        uint256 remainingDebt,
        uint256 borrowerRatio
    ) public {
        // We need the balance and debt ratio to be greater than 0 so that the borrower can take some seed funds from the lender.
        vm.assume(borrowerRatio <= MAX_BPS);
        vm.assume(remainingDebt <= balance);

        // Setup borrower and make a neutral report to take initial funds
        _testInitialBorrowerReport(balance, borrowerRatio);

        // Checking balance integrity.
        assertEq(lenderMock.balance() + lenderMock.totalDebt(), balance);

        remainingDebt = Math.min(
            remainingDebt,
            lenderMock.borrowerBalance(borrowerA)
        );

        // Preparing to the second report...
        // Take some of the funds from the borrower (assuming that some time has passed and the borrower has realized some loss)
        // NOTE: this function doesn't transfer funds from the borrower to the lender, it simply sets the borrower's balance
        lenderMock.decreaseBorrowerBalance(borrowerA, remainingDebt);

        // Let's report this gain on behalf of the borrower
        vm.prank(borrowerA);
        lenderMock.reportNegativeDebtManagement(remainingDebt, 0);

        // Checking balance integrity after the loss occured
        assertEq(
            lenderMock.balance() + lenderMock.totalDebt() + remainingDebt,
            balance
        );

        // Due to negative report, the borrower should have no available credit
        assertEq(lenderMock.availableCredit(borrowerA), 0);
    }

    function testMultipleBorrowersReports(
        uint192 initialBalance,
        uint256 borrowerARatio,
        uint256 borrowerBRatio,
        uint64 borrowerAGain,
        uint64 borrowerBLoss
    ) public {
        vm.assume(borrowerARatio <= MAX_BPS);
        vm.assume(borrowerBRatio <= MAX_BPS);
        vm.assume(borrowerARatio + borrowerBRatio <= MAX_BPS);
        vm.assume(borrowerAGain < (initialBalance * borrowerARatio) / MAX_BPS);
        vm.assume(borrowerBLoss < (initialBalance * borrowerBRatio) / MAX_BPS);

        lenderMock.setBalance(initialBalance);

        lenderMock.addBorrower(borrowerA, borrowerARatio);
        lenderMock.addBorrower(borrowerB, borrowerBRatio);

        // Make an initial reports to take some funds from the lender
        vm.prank(borrowerA);
        lenderMock.reportPositiveDebtManagement(0, 0);

        vm.prank(borrowerB);
        lenderMock.reportPositiveDebtManagement(0, 0);

        uint256 borrowerABalance = lenderMock.borrowerBalance(borrowerA);
        uint256 borrowerBBalance = lenderMock.borrowerBalance(borrowerB);

        // Checking whether borrowers have the amount of funds corresponding to their ratio
        assertEq(borrowerABalance, (initialBalance * borrowerARatio) / MAX_BPS);
        assertEq(borrowerBBalance, (initialBalance * borrowerBRatio) / MAX_BPS);

        // Checking that the entire initial balance was utilized
        assertEq(
            initialBalance,
            lenderMock.balance() + borrowerABalance + borrowerBBalance
        );

        // Ensure debt calculated correctly
        assertEq(initialBalance, lenderMock.balance() + lenderMock.totalDebt());
        assertEq(
            initialBalance,
            lenderMock.balance() +
                lenderMock.borrowerDebt(borrowerA) +
                lenderMock.borrowerDebt(borrowerB)
        );

        // Preparing for the second report
        lenderMock.increaseBorrowerBalance(borrowerA, borrowerAGain);
        lenderMock.decreaseBorrowerBalance(borrowerB, borrowerBLoss);

        vm.prank(borrowerA);
        lenderMock.reportPositiveDebtManagement(borrowerAGain, 0);

        vm.prank(borrowerB);
        lenderMock.reportNegativeDebtManagement(borrowerBLoss, 0);

        // Make sure we don't lose funds in the calculations
        assertEq(
            initialBalance,
            lenderMock.balance() +
                lenderMock.totalDebt() -
                borrowerAGain +
                borrowerBLoss
        );
    }

    function testReportShouldChangeLastReportTime(bool positiveReport) public {
        lenderMock.setBalance(10_000_000);
        lenderMock.addBorrower(borrowerA, MAX_BPS);

        assertEq(lenderMock.lastReportTimestamp(), block.timestamp);
        assertEq(
            lenderMock.borrowerLastReportTimestamp(borrowerA),
            block.timestamp
        );
        assertEq(
            lenderMock.borrowerActivationTimestamp(borrowerA),
            block.timestamp
        );

        uint256 newTimestamp = block.timestamp + 1000;
        vm.warp(newTimestamp);

        vm.prank(borrowerA);
        if (positiveReport) {
            lenderMock.reportPositiveDebtManagement(0, 0);
        } else {
            lenderMock.reportNegativeDebtManagement(0, 0);
        }

        assertEq(lenderMock.lastReportTimestamp(), newTimestamp);
        assertEq(
            lenderMock.borrowerLastReportTimestamp(borrowerA),
            newTimestamp
        );
    }

    // Checking a case where the borrower has a debt that needs to be repaid, and also received some profit
    function testPositiveReportWithOutstandingDebtPayment(
        uint192 initialBalance,
        uint64 borrowerRatio,
        uint64 loss,
        uint64 gain
    ) public {
        vm.assume(borrowerRatio <= MAX_BPS);

        uint256 borrowerFunds = (uint256(initialBalance) * borrowerRatio) /
            MAX_BPS;
        vm.assume(loss < borrowerFunds);
        vm.assume(gain < borrowerFunds);

        // Initial setup
        _testInitialBorrowerReport(initialBalance, borrowerRatio);

        // Adding a second borrower, just to take an excess balance from the lender
        lenderMock.addBorrower(borrowerB, MAX_BPS - borrowerRatio);
        vm.prank(borrowerB);
        lenderMock.reportPositiveDebtManagement(0, 0);

        // In some cases, when "loss" or "borrowerRatio" are small and/or odd numbers,
        // some amount of tokens is left on the lender's balance (due to rounding error).
        // We need to take this balance into account in order to use it in further checks.
        uint256 leftoverBalance = lenderMock.balance();
        if (leftoverBalance > 0) {
            assertEq(leftoverBalance, 1);
            lenderMock.setBalance(0);
        }

        // Decreasing borrower's credibility to produce outstanding debt
        lenderMock.decreaseBorrowerCredibility(borrowerA, loss);

        // Let's simulate a situation where the borrower has invested available funds,
        // received some profit, and freed up the necessary funds to repay the debt.
        uint256 debtPayment = lenderMock.outstandingDebt(borrowerA);
        lenderMock.setBorrowerBalance(borrowerA, uint256(gain) + debtPayment);

        // In this case, when the borrower's ratio is reduced,
        // the lender must take his profits and his debt payment funds
        vm.expectEmit(true, true, true, true);
        vm.prank(borrowerA);
        lenderMock.emitReportEvent(
            borrowerA,
            debtPayment,
            gain,
            0,
            uint256(gain) + debtPayment, // Taken funds
            0
        );

        vm.prank(borrowerA);
        lenderMock.reportPositiveDebtManagement(gain, debtPayment);

        // Make sure we don't lose funds in the calculations
        assertEq(
            initialBalance,
            lenderMock.balance() +
                lenderMock.totalDebt() -
                gain +
                loss +
                leftoverBalance
        );
    }

    // Testing "_testNegativeReportWithDebtPayment" with static values,
    // because sometimes rounding errors occur and it is difficult to make an assertion for the emitted event.
    function testNegativeReportWithDebtPayment() public {
        uint192 balance = 10000;
        uint256 ratio = MAX_BPS / 2;
        uint256 loss = 100;
        uint256 debt = 250;

        _testNegativeReportWithDebtPayment(balance, ratio, loss, debt, true);

        _resetMocks();
        balance = 22222;
        ratio = MAX_BPS;
        loss = 1000;
        debt = 500;

        _testNegativeReportWithDebtPayment(balance, ratio, loss, debt, true);

        _resetMocks();
        balance = 0;
        ratio = MAX_BPS;
        loss = 0;
        debt = 0;

        _testNegativeReportWithDebtPayment(balance, ratio, loss, debt, true);

        _resetMocks();
        balance = 22222;
        ratio = 0;
        loss = 0;
        debt = 0;

        _testNegativeReportWithDebtPayment(balance, ratio, loss, debt, true);
    }

    function testNegativeReportWithDebtPaymentFuzz(
        uint192 initialBalance,
        uint64 borrowerRatio,
        uint64 borrowerLoss,
        uint64 lossRealizedAsDebt
    ) public {
        vm.assume(borrowerRatio <= MAX_BPS);

        uint256 borrowerFunds = (uint256(initialBalance) * borrowerRatio) /
            MAX_BPS;
        vm.assume(uint256(borrowerLoss) + lossRealizedAsDebt < borrowerFunds);

        _testNegativeReportWithDebtPayment(
            initialBalance,
            borrowerRatio,
            borrowerLoss,
            lossRealizedAsDebt,
            false
        );
    }

    // Checking a case where the borrower has a debt that needs to be repaid and there are losses incurred
    function _testNegativeReportWithDebtPayment(
        uint192 initialBalance,
        uint256 borrowerRatio,
        uint256 borrowerLoss,
        uint256 lossRealizedAsDebt,
        bool assertEventEmit
    ) public {
        // Initial setup
        _testInitialBorrowerReport(initialBalance, borrowerRatio);

        // Adding a second borrower, just to take an excess balance from the lender
        lenderMock.addBorrower(borrowerB, MAX_BPS - borrowerRatio);
        vm.prank(borrowerB);
        lenderMock.reportPositiveDebtManagement(0, 0);

        // In some cases, when "loss" or "borrowerRatio" are small and/or odd numbers,
        // some amount of tokens is left on the lender's balance (due to rounding error).
        // We need to take this balance into account in order to use it in further checks.
        uint256 leftoverBalance = lenderMock.balance();
        if (leftoverBalance > 0) {
            assertEq(leftoverBalance, 1);
            lenderMock.setBalance(0);
        }

        // Decreasing borrower's credibility to produce outstanding debt
        if (lossRealizedAsDebt > 0) {
            lenderMock.decreaseBorrowerCredibility(
                borrowerA,
                lossRealizedAsDebt
            );
        }

        // Assume that the borrower is able to pay the entire outstanding debt
        uint256 debtPayment = lenderMock.outstandingDebt(borrowerA);

        // Let's simulate a situation where the borrower has invested available funds,
        // got some loss, and freed up the necessary funds to repay the debt.
        lenderMock.setBorrowerBalance(borrowerA, debtPayment);

        if (assertEventEmit) {
            // In this case, when the borrower's ratio is reduced,
            // the lender must take his profits and his debt payment funds
            vm.expectEmit(true, true, true, true);
            vm.prank(borrowerA);
            lenderMock.emitReportEvent(
                borrowerA,
                debtPayment,
                0,
                0,
                debtPayment,
                borrowerLoss
            );
        }

        vm.prank(borrowerA);
        lenderMock.reportNegativeDebtManagement(borrowerLoss, debtPayment);

        // Make sure we don't lose funds in the calculations
        assertEq(
            initialBalance,
            lenderMock.balance() +
                lenderMock.totalDebt() +
                borrowerLoss +
                lossRealizedAsDebt +
                leftoverBalance
        );
    }

    /// @dev For testing purposes, we will take all gains as management fees. See LenderMock.sol.
    function testFeesCharged(
        uint192 initialBalance,
        uint256 borrowerRatio,
        uint64 borrowerGain
    ) public {
        vm.assume(borrowerRatio <= MAX_BPS);
        vm.assume(
            borrowerGain > 0 &&
                borrowerGain < (initialBalance * borrowerRatio) / MAX_BPS
        );

        lenderMock.setBalance(initialBalance);
        lenderMock.addBorrower(borrowerA, borrowerRatio);

        vm.warp(block.timestamp + 1000);
        vm.prank(borrowerA);
        lenderMock.reportPositiveDebtManagement(0, 0);

        // Should not charge fees if reported gain is 0
        assertEq(lenderMock.getFeesCharges(), 0);

        lenderMock.increaseBorrowerBalance(borrowerA, borrowerGain);

        vm.warp(block.timestamp + 1000);
        vm.prank(borrowerA);
        lenderMock.reportPositiveDebtManagement(borrowerGain, 0);

        assertEq(lenderMock.getFeesCharges(), 1);
        assertEq(lenderMock.feesCharges(0), borrowerGain);
    }

    function testFeesNotChargedIfReportedTwice() public {
        lenderMock.setBalance(10_000);
        lenderMock.addBorrower(borrowerA, MAX_BPS);

        vm.warp(block.timestamp + 1000);
        vm.prank(borrowerA);
        lenderMock.reportPositiveDebtManagement(0, 0);

        // Should not charge fees if reported gain is 0
        assertEq(lenderMock.getFeesCharges(), 0);

        lenderMock.increaseBorrowerBalance(borrowerA, 1000);

        vm.prank(borrowerA);
        lenderMock.reportPositiveDebtManagement(1000, 0);

        assertEq(lenderMock.getFeesCharges(), 0);
    }

    function _testInitialBorrowerReport(uint192 balance, uint256 borrowerRatio)
        private
    {
        _testInitialBorrowerReport(
            borrowerA,
            balance,
            borrowerRatio,
            lenderMock.reportPositiveDebtManagement
        );
    }

    function _testInitialBorrowerReport(
        address borrower,
        uint192 balance,
        uint256 borrowerRatio,
        function(uint256, uint256) external report
    ) private {
        // "Give" some amount of funds to the lender
        lenderMock.setBalance(balance);
        assertEq(lenderMock.lendingAssets(), balance);

        // Register a new borrower
        lenderMock.addBorrower(borrower, borrowerRatio);
        assertEq(lenderMock.totalDebt(), 0);
        assertEq(lenderMock.debtRatio(), borrowerRatio);
        assertEq(lenderMock.borrowerDebtRatio(borrower), borrowerRatio);

        // Make sure that the lender has provided the borrower with the necessary amount of funds at the first report
        uint256 expectedBorrowerBalance = (uint256(balance) * borrowerRatio) /
            MAX_BPS;
        vm.expectEmit(true, true, true, true);
        lenderMock.emitReportEvent(
            borrowerA,
            0,
            0,
            expectedBorrowerBalance,
            0,
            0
        );

        // Lets assume it's a first report (no gains yet)
        vm.prank(borrower);
        report(0, 0);

        // Check whether the borrower's balance corresponds to his ratio
        assertEq(lenderMock.borrowerBalance(borrower), expectedBorrowerBalance);

        // After the report, the lender should have some funds if the borrower's ratio != MAX_BPS
        uint256 expectedLenderBalance = balance - expectedBorrowerBalance;
        assertEq(lenderMock.balance(), expectedLenderBalance);

        // Borrower's debt must be equal to the amount of tokens borrower has
        assertEq(lenderMock.borrowerDebt(borrower), expectedBorrowerBalance);

        // Lender must give an appropriate portion of the funds in debt
        assertEq(lenderMock.totalDebt(), expectedBorrowerBalance);

        // Borrower must obtain all available credit after the report
        assertEq(lenderMock.availableCredit(borrower), 0);
    }

    function _resetMocks() private {
        lenderMock = new LenderMock();
    }

    function _logBorrower(address borrower) private view {
        console.log("-=-=-=-=-=-=-=-=-=-=-=-=-=- Borrower", borrower);
        console.log("\tBalance", lenderMock.borrowerBalance(borrower));
        console.log("\tRatio", lenderMock.borrowerDebtRatio(borrower));
        console.log("\tDebt", lenderMock.borrowerDebt(borrower));
        console.log("\tOutstanding debt", lenderMock.outstandingDebt(borrower));
        console.log("\tAvailable credit", lenderMock.availableCredit(borrower));
        console.log("-=-=-=-=-=-=-=-=-=-=-=-=-=-");
    }

    function _logLender() private view {
        console.log("-=-=-=-=-=-=-=-=-=-=-=-=-=- Lender");
        console.log("\tBalance", lenderMock.balance());
        console.log("\tRatio", lenderMock.debtRatio());
        console.log("\tDebt", lenderMock.totalDebt());
        console.log("-=-=-=-=-=-=-=-=-=-=-=-=-=-");
    }
}
