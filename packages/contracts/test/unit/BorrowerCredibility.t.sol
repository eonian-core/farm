// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.19;

import {Test} from "forge-std/Test.sol";
import {IERC20Upgradeable} from "contracts/tokens/ERC4626Upgradeable.sol";
import {ERC20Mock} from "./mocks/ERC20Mock.sol";
import {VaultMock} from "./mocks/VaultMock.sol";
import {StrategyBorrowerMock} from "./mocks/StrategyBorrowerMock.sol";
import {OpsMock} from "./mocks/OpsMock.sol";
import {AggregatorV3Mock} from "./mocks/AggregatorV3Mock.sol";

import {TestWithERC1820Registry} from "./helpers/TestWithERC1820Registry.sol";

contract BorrowerCredibilityTest is TestWithERC1820Registry {
    ERC20Mock internal underlying;
    VaultMock internal vault;

    OpsMock internal ops;
    AggregatorV3Mock internal nativeTokenPriceFeed;
    AggregatorV3Mock internal assetPriceFeed;

    StrategyBorrowerMock internal strategyA;
    StrategyBorrowerMock internal strategyB;

    address internal rewards = vm.addr(1);
    address internal alice = vm.addr(2);

    uint256 internal MAX_BPS = 10000;

    event AdjustPositionCalled(uint256 outstandingDebt, uint256 adjustedAmount);
    event LiquidatePositionCalled(uint256 liquidated, uint256 loss);
    event WinthdrawnFromStrategy(address indexed strategy, uint256 requiredAmount, uint256 withdrawnAmount, uint256 loss);
    event BorrowerDebtRatioChanged(address indexed borrower, uint256 newDebtRatio, uint256 newTotalDebtRatio, uint256 loss);
    event BorrowerDebtChanged(address indexed borrower, uint256 newDebt, uint256 newTotalDebt);

    // solhint-disable-next-line function-max-lines
    function setUp() public {
        vm.label(rewards, "rewards");
        vm.label(alice, "alice");

        underlying = new ERC20Mock("Mock Token", "TKN");
        vm.label(address(underlying), "underlying");

        uint256 defaultFee = 1000;
        uint256 defaultLPRRate = 10 ** 18;
        uint256 defaultFounderFee = 100;
        vault = new VaultMock(
            address(underlying),
            rewards,
            defaultFee,
            defaultLPRRate,
            defaultFounderFee
        );
        vm.label(address(vault), "vault");

        ops = new OpsMock();
        ops.setGelato(payable(alice));
        vm.label(address(ops), "ops");

        nativeTokenPriceFeed = new AggregatorV3Mock();
        nativeTokenPriceFeed.setDecimals(8);
        nativeTokenPriceFeed.setPrice(274 * 1e8);
        vm.label(address(nativeTokenPriceFeed), "nativeTokenPriceFeed");

        assetPriceFeed = new AggregatorV3Mock();
        assetPriceFeed.setDecimals(8);
        assetPriceFeed.setPrice(1e8);
        vm.label(address(assetPriceFeed), "assetPriceFeed");

        strategyA = new StrategyBorrowerMock(
            vault,
            IERC20Upgradeable(address(underlying)),
            ops,
            3600,
            false,
            nativeTokenPriceFeed,
            assetPriceFeed
        );
        vm.label(address(strategyA), "strategyA");

        strategyB = new StrategyBorrowerMock(
            vault,
            IERC20Upgradeable(address(underlying)),
            ops,
            3600,
            false,
            nativeTokenPriceFeed,
            assetPriceFeed
        );
        vm.label(address(strategyB), "strategyB");
    }

    function testShouldIncreaseDebt(uint128 _amountA, uint128 _amountB, uint128 _ratioA, uint128 _ratioB) public {
        uint256 amountA = _amountA;
        uint256 amountB = _amountB;
        uint256 ratioA = _ratioA;
        uint256 ratioB = _ratioB;
        vm.assume(ratioA + ratioB <= MAX_BPS);
        
        // Initialize the strategy and add it to the vault.
        vm.expectEmit(true, true, true, true);
        emit BorrowerDebtRatioChanged(address(strategyA), ratioA, ratioA, 0);
        vault.addStrategy(address(strategyA), ratioA);
        vm.prank(address(strategyA));
        assertEq(vault.hasStrategyAsBorrower(address(strategyA)), true);

        // Strategy has no dept yet.
        assertEq(vault.currentDebt(address(strategyA)), 0);
        assertEq(vault.currentDebtRatio(address(strategyA)), ratioA);
        assertEq(vault.totalDebt(), 0);
        assertEq(vault.debtRatio(), ratioA);

        vm.expectEmit(true, true, true, true);
        emit BorrowerDebtChanged(address(strategyA), amountA, amountA);
        vault.increaseDebt(address(strategyA), amountA);

        assertEq(vault.currentDebt(address(strategyA)), amountA);
        assertEq(vault.currentDebtRatio(address(strategyA)), ratioA);
        assertEq(vault.totalDebt(), amountA);
        assertEq(vault.debtRatio(), ratioA);

        vm.expectEmit(true, true, true, true);
        emit BorrowerDebtRatioChanged(address(strategyB), ratioB, ratioA + ratioB, 0);
        vault.addStrategy(address(strategyB), ratioB);
        vm.prank(address(strategyB));
        assertEq(vault.hasStrategyAsBorrower(address(strategyB)), true);

        assertEq(vault.currentDebt(address(strategyB)), 0);
        assertEq(vault.currentDebtRatio(address(strategyB)), ratioB);
        assertEq(vault.totalDebt(), amountA);
        assertEq(vault.debtRatio(), ratioA + ratioB);

        vm.expectEmit(true, true, true, true);
        emit BorrowerDebtChanged(address(strategyB), amountB, amountA + amountB);
        vault.increaseDebt(address(strategyB), amountB);

        assertEq(vault.currentDebt(address(strategyB)), amountB);
        assertEq(vault.currentDebtRatio(address(strategyB)), ratioB);
        assertEq(vault.totalDebt(), amountA + amountB);
        assertEq(vault.debtRatio(), ratioA + ratioB);
    }

    function testShouldDecreaseDebt(uint128 _amountA, uint128 _amountToDecrease, uint128 _ratioA) public {
        uint256 amountA = _amountA;
        uint256 amountToDecrease = _amountToDecrease;
        uint256 ratioA = _ratioA;
        vm.assume(ratioA <= MAX_BPS);
        vm.assume(amountA >= amountToDecrease);
        
        // Initialize the strategy and add it to the vault.
        vm.expectEmit(true, true, true, true);
        emit BorrowerDebtRatioChanged(address(strategyA), ratioA, ratioA, 0);
        vault.addStrategy(address(strategyA), ratioA);
        vm.prank(address(strategyA));
        assertEq(vault.hasStrategyAsBorrower(address(strategyA)), true);

        // Strategy has no dept yet.
        assertEq(vault.currentDebt(address(strategyA)), 0);
        assertEq(vault.currentDebtRatio(address(strategyA)), ratioA);
        assertEq(vault.totalDebt(), 0);
        assertEq(vault.debtRatio(), ratioA);

        vm.expectEmit(true, true, true, true);
        emit BorrowerDebtChanged(address(strategyA), amountA, amountA);
        vault.increaseDebt(address(strategyA), amountA);

        assertEq(vault.currentDebt(address(strategyA)), amountA);
        assertEq(vault.currentDebtRatio(address(strategyA)), ratioA);
        assertEq(vault.totalDebt(), amountA);
        assertEq(vault.debtRatio(), ratioA);

        vm.expectEmit(true, true, true, true);
        emit BorrowerDebtChanged(address(strategyA), amountA - amountToDecrease, amountA - amountToDecrease);
        vault.decreaseDebt(address(strategyA), amountToDecrease);

        assertEq(vault.currentDebt(address(strategyA)), amountA - amountToDecrease);
        assertEq(vault.currentDebtRatio(address(strategyA)), ratioA);
        assertEq(vault.totalDebt(), amountA - amountToDecrease);
        assertEq(vault.debtRatio(), ratioA);
    }

    /** Checks that the withdrawn from strategy should decrease total debt */
    function testShouldDecreaseTotalDebtAfterBorrowerWithdrawn() public {
        uint256 _120_USDT = 120 * 10 ** 18;
        uint256 _60_USDT = 60 * 10 ** 18;

        // Deposit some amount of funds to the vault on behalf of Alice.
        depositToVault(alice, _120_USDT);
        assertEq(vault.totalAssets(), _120_USDT);

        // Initialize the strategy and connect it to the vault.
        initAndHarvestStrategy(strategyA, _120_USDT, MAX_BPS);

        // Alice wants to take back 50% of her funds.
        vm.expectEmit(true, true, true, true);
        emit LiquidatePositionCalled(_60_USDT, 0);
        vm.prank(alice);
        vault.withdraw(_60_USDT);
        assertEq(underlying.balanceOf(alice), _60_USDT);

        // The debt of the strategy must be reduced by the withdrawal amount.
        assertEq(vault.currentDebt(address(strategyA)), _60_USDT);

        // Total debt should be decreased as well.
        assertEq(vault.totalDebt(), _60_USDT);
    }

    /**
        Checks that the strategy's creditworthiness is reduced if it was unable to provide the requested amount of funds when withdrawn.
    */
    function testShouldDecreaseStrategyCredibilityByWithdrawLoss() public {
        uint256 _120_USDT = 120 * 10 ** 18;
        uint256 _60_USDT = 60 * 10 ** 18;
        uint256 _50_USDT = 50 * 10 ** 18;
        uint256 _30_USDT = 30 * 10 ** 18;
        uint256 _10_USDT = 10 * 10 ** 18;
        uint256 _80_USDT = 80 * 10 ** 18;
        uint256 _90_USDT = 90 * 10 ** 18;

        // Deposit some amount of funds to the vault on behalf of Alice.
        depositToVault(alice, _120_USDT);
        assertEq(vault.totalAssets(), _120_USDT);

        // --------------- FIRST CYCLE ---------------

        // Initialize the strategies and add them to the vault.
        // Dividing the deposited amount in half for each strategy.
        initAndHarvestStrategy(strategyA, _60_USDT, MAX_BPS / 2);
        initAndHarvestStrategy(strategyB, _60_USDT, MAX_BPS / 2);

        // Loss occured, first strategy lost the half of its funds (25% of total Alice deposit).
        strategyA.TEST_makeLoss(_30_USDT);
        assertEq(strategyA.estimatedTotalAssets(), _30_USDT);
        assertEq(vault.currentDebt(address(strategyA)), _60_USDT);

        // --------------- WITHDRAWN ---------------

        // Alice wants to take back 75% of her funds.
        // Each strategy contains 50% of her funds.
        vm.expectEmit(true, true, true, true);
        emit LiquidatePositionCalled(_30_USDT, _30_USDT);
        vm.expectEmit(true, true, true, true);
        emit BorrowerDebtChanged(address(strategyA), _30_USDT, _90_USDT);
        vm.expectEmit(true, true, true, true);
        emit BorrowerDebtRatioChanged(address(strategyA), MAX_BPS / 4, 3 * MAX_BPS / 4, _30_USDT);
        vm.expectEmit(true, true, true, true);
        emit BorrowerDebtChanged(address(strategyA), 0, _60_USDT);
        vm.expectEmit(true, true, true, true);
        emit WinthdrawnFromStrategy(address(strategyA), _60_USDT, _30_USDT, _30_USDT);
        vm.expectEmit(true, true, true, true);
        emit LiquidatePositionCalled(_50_USDT, 0);
        vm.expectEmit(true, true, true, true);
        emit BorrowerDebtChanged(address(strategyB), _10_USDT, _10_USDT);
        vm.expectEmit(true, true, true, true);
        emit WinthdrawnFromStrategy(address(strategyB), _50_USDT, _50_USDT, 0);
        vm.prank(alice);
        vault.withdraw(_80_USDT);
        assertEq(underlying.balanceOf(alice), _80_USDT);
        assertEq(vault.totalAssets(), _10_USDT);

        // If the vault could not withdraw all of the requested funds from the first strategy (because it faced losses),
        // it must reduce the strategy's debt ratio.
        // Since the loss was equal to half of the original deposit, the debt ratio also decreased by half.
        vm.prank(address(strategyA));
        assertEq(vault.currentDebtRatio(), 2500);
        // but the debt will be rebalanced only on the next harvest
        // and most of the assets was withdrawn from the first strategy
        assertEq(vault.currentDebt(address(strategyA)), 0);

        vm.prank(address(strategyB));
        assertEq(vault.currentDebtRatio(), MAX_BPS / 2);
        // All vault assets were left in the second strategy and waiting for rebalance 
        assertEq(vault.currentDebt(address(strategyB)), _10_USDT);

        // Total debt should be decreased as well.
        // Only 3/4 of the total assets must be lend to the strategies.
        // But they will be rabalanced only in next harvest
        assertEq(vault.debtRatio(), 3 * MAX_BPS / 4);
        assertEq(vault.totalDebt(), _10_USDT);

        // --------------- SECOND CYCLE ---------------

        // harvest of first strategy must not change the state
        strategyA.callWork();

        vm.prank(address(strategyA));
        assertEq(vault.currentDebtRatio(), 2500);
        assertEq(vault.currentDebt(address(strategyA)), 0);

        vm.prank(address(strategyB));
        assertEq(vault.currentDebtRatio(), MAX_BPS / 2);
        assertEq(vault.currentDebt(address(strategyB)), _10_USDT);

        assertEq(vault.debtRatio(), 3 * MAX_BPS / 4);
        assertEq(vault.totalDebt(), _10_USDT);

        // ------------------ THIRD CYCLE ------------------

        // harvest of second strategy must trigger partial rebalance
        strategyB.callWork();

        vm.prank(address(strategyA));
        assertEq(vault.currentDebtRatio(), 2500);
        assertEq(vault.currentDebt(address(strategyA)), 0);

        // half of assets must be withdrawn from second strategy
        vm.prank(address(strategyB));
        assertEq(vault.currentDebtRatio(), MAX_BPS / 2);
        assertEq(vault.currentDebt(address(strategyB)), _10_USDT / 2);

        // 3/4 of the total assets expect to be lend to the strategies.
        // but only half of assets must be lend at this point
        assertEq(vault.debtRatio(), 3 * MAX_BPS / 4);
        assertEq(vault.totalDebt(), _10_USDT / 2);

        // ------------------ FOURTH CYCLE ------------------

        // harvest of first strategy must trigger final reblance
        strategyA.callWork();

        // 1/4 of assets must be given to first strategy
        vm.prank(address(strategyA));
        assertEq(vault.currentDebtRatio(), 2500);
        assertEq(vault.currentDebt(address(strategyA)), _10_USDT / 4);

        // second strategy must be left as it is
        vm.prank(address(strategyB));
        assertEq(vault.currentDebtRatio(), MAX_BPS / 2);
        assertEq(vault.currentDebt(address(strategyB)), _10_USDT / 2);

        // 3/4 of the total assets were lend to the strategies.
        assertEq(vault.debtRatio(), 3 * MAX_BPS / 4);
        assertEq(vault.totalDebt(), 3 * _10_USDT / 4);
    }

    function initAndHarvestStrategy(
        StrategyBorrowerMock strategyMock,
        uint256 balance,
        uint256 ratio
    ) internal {
        address strategyAddr = address(strategyMock);

        // Initialize the strategy and add it to the vault.
        vault.addStrategy(strategyAddr, ratio);
        vm.prank(strategyAddr);
        assertEq(vault.hasStrategyAsBorrower(strategyAddr), true);


        // Strategy has no dept yet.
        assertEq(vault.currentDebt(strategyAddr), 0);
        assertEq(vault.currentDebtRatio(strategyAddr), ratio);

        // Trigger initial report to move the funds to the strategy.
        strategyMock.callWork();
        assertEq(vault.currentDebt(strategyAddr), balance);

        // Strategy adjusted all the free balance to underlying protocol.
        assertEq(underlying.balanceOf(strategyAddr), 0);
        assertEq(strategyMock.estimatedTotalAssets(), balance);
    }

    function depositToVault(address actor, uint256 amount) internal {
        // Give the required funds to Actor
        underlying.mint(actor, amount);
        assertEq(underlying.balanceOf(actor), amount);

        // Allow to vault to take the Actor's assets
        vm.prank(actor);
        underlying.increaseAllowance(address(vault), type(uint256).max);

        // Actor deposits funds to the vault
        vm.prank(actor);
        vault.deposit(amount);
    }
}
