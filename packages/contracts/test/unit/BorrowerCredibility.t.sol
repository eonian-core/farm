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
        vm.label(address(strategyA), "strategyB");
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
        expectLiquidation({strategy: strategyA, amount: _60_USDT, loss: 0});
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
        uint256 _80_USDT = 80 * 10 ** 18;

        // Deposit some amount of funds to the vault on behalf of Alice.
        depositToVault(alice, _120_USDT);
        assertEq(vault.totalAssets(), _120_USDT);

        // Initialize the strategies and add them to the vault.
        // Dividing the deposited amount in half for each strategy.
        initAndHarvestStrategy(strategyA, _60_USDT, MAX_BPS / 2);
        initAndHarvestStrategy(strategyB, _60_USDT, MAX_BPS / 2);

        // Loss occured, first strategy lost the half of its funds (25% of total Alice deposit).
        strategyA.TEST_makeLoss(_30_USDT);
        assertEq(strategyA.estimatedTotalAssets(), _30_USDT);
        assertEq(vault.currentDebt(address(strategyA)), _60_USDT);

        // Alice wants to take back 75% of her funds.
        // Each strategy contains 50% of her funds.
        expectLiquidation({
            strategy: strategyA,
            amount: _30_USDT,
            loss: _30_USDT
        });
        expectLiquidation({strategy: strategyB, amount: _50_USDT, loss: 0});
        vm.prank(alice);
        vault.withdraw(_80_USDT);
        assertEq(underlying.balanceOf(alice), _80_USDT);

        // If the vault could not withdraw all of the requested funds from the first strategy (because it faced losses),
        // it must reduce the strategy's debt ratio.
        // Since the loss was equal to half of the original deposit, the debt ratio also decreased by half.
        vm.prank(address(strategyA));
        assertEq(vault.currentDebtRatio(), 2500);
        assertEq(vault.currentDebt(address(strategyA)), _30_USDT);

        // Total debt should be decreased as well.
        assertEq(vault.totalDebt(), _120_USDT - _30_USDT);
    }

    function expectLiquidation(
        StrategyBorrowerMock strategy,
        uint256 amount,
        uint256 loss
    ) internal {
        vm.expectEmit(true, true, true, true);
        strategy.emitLiquidatePositionCalled(amount, loss);
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
