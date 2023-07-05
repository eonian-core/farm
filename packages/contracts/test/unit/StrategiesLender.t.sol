// SPDX-License-Identifier: AGPL-3.0-only
pragma solidity >=0.8.10;

import "forge-std/Test.sol";
import "@openzeppelin/contracts/utils/math/Math.sol";

import "./mocks/StrategiesLenderMock.sol";
import "./mocks/ERC20Mock.sol";
import "./mocks/StrategyMock.sol";

import "contracts/lending/Lender.sol";
import "contracts/lending/StrategiesLender.sol";

import "./helpers/TestWithERC1820Registry.sol";

contract StrategiesLenderTest is TestWithERC1820Registry {
    uint256 constant MAX_BPS = 10_000;
    uint256 constant LOCKED_PROFIT_RELEASE_SCALE = 10**18;

    ERC20Mock underlying;
    StrategiesLenderMock lender;

    StrategyMock strategy;

    address rewards = vm.addr(1);
    address culprit = vm.addr(2);

    address alice = vm.addr(10);
    address bob = vm.addr(11);

    uint256 defaultFee = 1000;
    uint256 defaultLPRRate = 10**18;

    function setUp() public {
        vm.label(rewards, "rewards");
        vm.label(culprit, "culprit");

        vm.label(alice, "Alice");
        vm.label(bob, "Bob");

        underlying = new ERC20Mock("Mock Token", "TKN");
        lender = new StrategiesLenderMock();

        strategy = new StrategyMock(address(underlying), address(lender));
    }


    function testAddingStrategy(uint16 debtRatio) public {
        vm.assume(debtRatio <= MAX_BPS);

        address strategyAddress = address(strategy);

        vm.expectEmit(true, true, true, true);
        lender.emitStrategyAddedEvent(strategyAddress, debtRatio);

        lender.addStrategy(strategyAddress, debtRatio);
        assertEq(lender.withdrawalQueue(0), strategyAddress);
        assertEq(lender.hasStrategyAsBorrower(strategyAddress), true);
        assertEq(lender.beforeStrategyRegisteredCalled(), 1);
    }

    function testRevertWhenAddingStrategyAndVaultIsPaused() public {
        lender.setEmergencyShutdown(true);

        vm.expectRevert(bytes("Pausable: paused"));
        lender.addStrategy(address(strategy), MAX_BPS);
    }

    function testRevertWhenAddingStrategyFromNonOwnerAccount() public {
        vm.expectRevert(bytes("Ownable: caller is not the owner"));

        vm.prank(culprit);
        lender.addStrategy(address(strategy), MAX_BPS);
    }

    function testRevokingStrategy(uint16 debtRatio) public {
        vm.assume(debtRatio <= MAX_BPS);

        address strategyAddress = address(strategy);

        lender.addStrategy(strategyAddress, debtRatio);
        assertEq(lender.debtRatio(), debtRatio);
        assertEq(lender.currentDebtRatio(strategyAddress), debtRatio);
        assertEq(lender.beforeStrategyRegisteredCalled(), 1);

        vm.expectEmit(true, true, true, true);
        lender.emitStrategyRevokedEvent(strategyAddress);

        lender.revokeStrategy(strategyAddress);
        assertEq(lender.debtRatio(), 0);
        assertEq(lender.currentDebtRatio(strategyAddress), 0);
        assertEq(lender.beforeStrategyRegisteredCalled(), 1);
    }

    function testRevertWhenRevokingStrategyFromNonOwnerAccount() public {
        address strategyAddress = address(strategy);
        lender.addStrategy(strategyAddress, MAX_BPS);

        vm.expectRevert(
            abi.encodeWithSelector(AccessDeniedForCaller.selector, culprit)
        );

        vm.prank(culprit);
        lender.revokeStrategy(strategyAddress);
    }

    function testRemovingStrategy(bool fromQueueOnly) public {
        address strategyAddress = address(strategy);

        // We can only delete a strategy with 0 debt ratio
        lender.addStrategy(strategyAddress, 0);

        vm.expectEmit(true, true, true, true);
        lender.emitStrategyRemovedEvent(strategyAddress, fromQueueOnly);

        lender.removeStrategy(strategyAddress, fromQueueOnly);

        assertEq(lender.getQueueSize(), 0);
        assertEq(lender.hasStrategyAsBorrower(strategyAddress), fromQueueOnly);
    }

    function testRevertWhenRemovingStrategyWithDebt(uint16 debtRatio) public {
        vm.assume(debtRatio > 0 && debtRatio <= MAX_BPS);
        address strategyAddress = address(strategy);

        // We can only delete a strategy with 0 debt ratio
        lender.addStrategy(strategyAddress, debtRatio);

        vm.expectRevert(BorrowerHasDebt.selector);
        lender.removeStrategy(strategyAddress, false);
    }

    function testRevertWhenRemovingMissingStrategy(bool fromQueueOnly) public {
        address strategyAddress = address(strategy);

        vm.expectRevert(StrategyNotFound.selector);

        lender.removeStrategy(strategyAddress, fromQueueOnly);
    }

    function testRevertWhenRemovingStrategyFromNonOwnerAccount(
        bool fromQueueOnly
    ) public {
        address strategyAddress = address(strategy);
        lender.addStrategy(strategyAddress, 0);

        vm.expectRevert(bytes("Ownable: caller is not the owner"));

        vm.prank(culprit);
        lender.removeStrategy(strategyAddress, fromQueueOnly);
    }

    function testAddingStrategyToQueue() public {
        address strategyAddress = address(strategy);
        lender.addStrategy(strategyAddress, 0);
        assertEq(lender.beforeStrategyRegisteredCalled(), 1);

        // Removing strategy from queue only
        lender.removeStrategy(strategyAddress, true);

        assertEq(lender.getQueueSize(), 0);
        assertEq(lender.hasStrategyAsBorrower(strategyAddress), true);
        assertEq(lender.beforeStrategyRegisteredCalled(), 1);

        vm.expectEmit(true, true, true, true);
        lender.emitStrategyReturnedToQueueEvent(strategyAddress);
        lender.addStrategyToQueue(strategyAddress);

        assertEq(lender.getQueueSize(), 1);
        assertEq(lender.hasStrategyAsBorrower(strategyAddress), true);
        assertEq(lender.beforeStrategyRegisteredCalled(), 1);
    }

    function testRevertAddingStrategyToQueueWithZeroAddress() public {
        vm.expectRevert(UnexpectedZeroAddress.selector);
        lender.addStrategyToQueue(address(0));
    }

    function testRevertAddingStrategyToQueueIfAlreadyExists() public {
        address strategyAddress = address(strategy);
        lender.addStrategy(strategyAddress, 0);

        assertEq(lender.getQueueSize(), 1);
        assertEq(lender.hasStrategyAsBorrower(strategyAddress), true);
        assertEq(lender.beforeStrategyRegisteredCalled(), 1);

        vm.expectRevert(StrategyAlreadyExists.selector);

        lender.addStrategyToQueue(strategyAddress);
    }

    function testRevertAddingStrategyToQueueIfNotRegistered() public {
        vm.expectRevert(BorrowerDoesNotExist.selector);

        address strategyAddress = address(strategy);
        lender.addStrategyToQueue(strategyAddress);
    }

    function testRevertWhenAddingStrategyToQueueFromNonOwnerAccount() public {
        vm.expectRevert(bytes("Ownable: caller is not the owner"));

        vm.prank(culprit);
        address strategyAddress = address(strategy);
        lender.addStrategyToQueue(strategyAddress);
    }

    /// @dev See detailed reordering test implementations in AddressList.t.sol
    function testReorderingWithdrawalQueue() public {
        lender.addStrategy(address(strategy), 0);
        assertEq(lender.beforeStrategyRegisteredCalled(), 1);

        StrategyMock strategyB = new StrategyMock(
            address(underlying),
            address(lender)
        );
        lender.addStrategy(address(strategyB), 0);

        assertEq(lender.getQueueSize(), 2);
        assertEq(lender.withdrawalQueue(0), address(strategy));
        assertEq(lender.withdrawalQueue(1), address(strategyB));
        assertEq(lender.beforeStrategyRegisteredCalled(), 2);

        address[] memory newOrder = new address[](2);
        newOrder[0] = address(strategyB);
        newOrder[1] = address(strategy);
        lender.reorderWithdrawalQueue(newOrder);

        assertEq(lender.getQueueSize(), 2);
        assertEq(lender.withdrawalQueue(0), address(strategyB));
        assertEq(lender.withdrawalQueue(1), address(strategy));
    }

    function testReorderingWithdrawalQueueFromNonOwnerAccount() public {
        lender.addStrategy(address(strategy), 0);
        assertEq(lender.beforeStrategyRegisteredCalled(), 1);

        StrategyMock strategyB = new StrategyMock(
            address(underlying),
            address(lender)
        );
        lender.addStrategy(address(strategyB), 0);

        assertEq(lender.getQueueSize(), 2);
        assertEq(lender.withdrawalQueue(0), address(strategy));
        assertEq(lender.withdrawalQueue(1), address(strategyB));
        assertEq(lender.beforeStrategyRegisteredCalled(), 2);

        address[] memory newOrder = new address[](2);
        newOrder[0] = address(strategyB);
        newOrder[1] = address(strategy);

        vm.expectRevert(bytes("Ownable: caller is not the owner"));
        vm.prank(culprit);
        lender.reorderWithdrawalQueue(newOrder);
    }

    function testInterestRatePerBlock(
        uint256 totalDebt,
        uint128 _utilisationRateA, uint128 _utilisationRateB, 
        uint128 interestA, uint128 interestB
    ) public {
        uint256 utilisationRateA = _utilisationRateA;
        uint256 utilisationRateB = _utilisationRateB;
        vm.assume(utilisationRateA + utilisationRateB <= MAX_BPS);

        lender.setTotalDebt(totalDebt);

        lender.addStrategy(address(strategy), 0);
        lender.setUtilisationRate(address(strategy), utilisationRateA);
        strategy.setInterestRatePerBlock(interestA);

        StrategyMock strategyB = new StrategyMock(
            address(underlying),
            address(lender)
        );
        lender.addStrategy(address(strategyB), 0);
        lender.setUtilisationRate(address(strategyB), utilisationRateB);
        strategyB.setInterestRatePerBlock(interestB);

        (uint256 interest, uint256 utilisation) = lender.interestRatePerBlock();

        uint256 expectedUtilisation = utilisationRateA + utilisationRateB;
        if(expectedUtilisation == 0 || totalDebt == 0) {    
            assertEq(interest, 0);
            assertEq(utilisation, 0);
        } else {
            uint256 expectedInterest = 
                utilisationRateA * uint256(interestA) / MAX_BPS +
                utilisationRateB * uint256(interestB) / MAX_BPS;

            assertEq(interest, expectedInterest);
            assertEq(utilisation, expectedUtilisation);
        }
    }

    function testSetBorrowerDebtRatio(
        uint64 initialBorrowerDebtRatio,
        uint64 borrowerDebtRatio
    ) public {
        vm.assume(initialBorrowerDebtRatio <= MAX_BPS);
        vm.assume(borrowerDebtRatio <= MAX_BPS);

        lender.addStrategy(address(strategy), initialBorrowerDebtRatio);
        assertEq(
            lender.currentDebtRatio(address(strategy)),
            initialBorrowerDebtRatio
        );

        lender.setBorrowerDebtRatio(address(strategy), borrowerDebtRatio);
        assertEq(lender.currentDebtRatio(address(strategy)), borrowerDebtRatio);
        assertEq(lender.debtRatio(), borrowerDebtRatio);
    }

    function testSetBorrowerDebtRatioFromNonOwnerAccount(
        uint64 initialBorrowerDebtRatio,
        uint64 borrowerDebtRatio
    ) public {
        vm.assume(initialBorrowerDebtRatio <= MAX_BPS);
        vm.assume(borrowerDebtRatio <= MAX_BPS);

        lender.addStrategy(address(strategy), initialBorrowerDebtRatio);
        assertEq(
            lender.currentDebtRatio(address(strategy)),
            initialBorrowerDebtRatio
        );

        vm.expectRevert(bytes("Ownable: caller is not the owner"));

        vm.prank(culprit);
        lender.setBorrowerDebtRatio(address(strategy), borrowerDebtRatio);
    }
    
}
