// SPDX-License-Identifier: AGPL-3.0
pragma solidity ^0.8.0;

import "forge-std/Test.sol";

import "@openzeppelin/contracts/utils/math/Math.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

import "./mocks/VaultMock.sol";
import "./mocks/ERC20Mock.sol";
import "./mocks/StrategyMock.sol";
import "./mocks/OpsMock.sol";
import "./mocks/BaseStrategyMock.sol";
import "./mocks/AggregatorV3Mock.sol";
import "./mocks/CTokenMock.sol";
import "./mocks/RainMakerMock.sol";
import "./mocks/PancakeRouterMock.sol";
import "./mocks/ApeLendingStrategyMock.sol";
import "./mocks/VaultFounderTokenMock.sol";
import "./mocks/LossRatioHealthCheckMock.sol";

import "contracts/strategies/CTokenBaseStrategy.sol";

import "./helpers/TestWithERC1820Registry.sol";

contract ApeLendingStrategyTest is TestWithERC1820Registry {
    address private constant BANANA =
        0x603c7f932ED1fc6575303D8Fb018fDCBb0f39a95;
    address private constant WBNB = 0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c;
    address private constant RAIN_MAKER =
        0x5CB93C0AdE6B7F2760Ec4389833B0cCcb5e4efDa;
    address private constant PANCAKE_ROUTER =
        0x10ED43C718714eb63d5aA57B78B54704E256024E;
    uint256 private constant SECONDS_PER_BLOCK = 3;
    uint256 private constant REWARD_ESTIMATION_ACCURACY = 90;

    ERC20Mock underlying;
    VaultMock vault;
    OpsMock ops;
    CTokenMock cToken;
    VaultFounderTokenMock vaultFounderToken;

    address rewards = vm.addr(1);
    address alice = vm.addr(2);
    address culprit = vm.addr(333);

    uint256 defaultFee = 1000;
    uint256 defaultLPRRate = 10**18;
    uint256 defaultFounderFee = 100;

    uint256 minReportInterval = 3600;
    bool isPrepaid = false;

    AggregatorV3Mock nativeTokenPriceFeed;
    AggregatorV3Mock assetPriceFeed;

    RainMakerMock rainMaker;
    PancakeRouterMock pancakeRouter;

    ApeLendingStrategyMock strategy;

    event DepositedToProtocol(uint256 amount, uint256 sharesBefore, uint256 underlyingBefore, uint256 sharesAfter, uint256 underlyingAfter);
    event WithdrawnFromProtocol(uint256 amount, uint256 sharesBefore, uint256 underlyingBefore, uint256 sharesAfter, uint256 underlyingAfter, uint256 redeemedAmount);

    function setUp() public {
        vm.label(rewards, "rewards");
        vm.label(alice, "alice");
        vm.label(culprit, "culprit");

        underlying = new ERC20Mock("Mock Token", "TKN");
        vm.label(address(underlying), "underlying");

        vaultFounderToken = new VaultFounderTokenMock(3, 12_000, 200, vault);

        vault = new VaultMock(
            address(underlying),
            rewards,
            defaultFee,
            defaultLPRRate,
            defaultFounderFee
        );
        vaultFounderToken.setVault(vault);

        vm.label(address(vault), "vault");

        ops = new OpsMock();
        ops.setGelato(payable(alice));
        vm.label(address(ops), "ops");

        cToken = new CTokenMock(underlying);
        vm.label(address(cToken), "cToken");

        nativeTokenPriceFeed = new AggregatorV3Mock();
        nativeTokenPriceFeed.setDecimals(8);
        nativeTokenPriceFeed.setPrice(274 * 1e8);

        assetPriceFeed = new AggregatorV3Mock();
        assetPriceFeed.setDecimals(8);
        assetPriceFeed.setPrice(1e8);

        ERC20Mock banana = new ERC20Mock("BANANA", "BANANA");
        vm.etch(BANANA, address(banana).code);

        vm.etch(RAIN_MAKER, address(new RainMakerMock()).code);
        rainMaker = RainMakerMock(RAIN_MAKER);
        rainMaker.setCompSupplySpeeds(31250000000000000);

        vm.etch(PANCAKE_ROUTER, address(new PancakeRouterMock()).code);
        pancakeRouter = PancakeRouterMock(PANCAKE_ROUTER);

        strategy = new ApeLendingStrategyMock(
            address(vault),
            address(underlying),
            address(cToken),
            address(ops),
            address(nativeTokenPriceFeed),
            address(assetPriceFeed),
            minReportInterval,
            isPrepaid
        );
        strategy.setHealthCheck(address(new LossRatioHealthCheckMock(1_500)));
        vault.addStrategy(address(strategy), 10_000);
    }

    function testShouldRevertIfCTokenDecimalsAreWrong() public {
        cToken.setDecimals(18);

        vm.expectRevert(UnsupportedDecimals.selector);
        strategy = new ApeLendingStrategyMock(
            address(vault),
            address(underlying),
            address(cToken),
            address(ops),
            address(nativeTokenPriceFeed),
            address(assetPriceFeed),
            minReportInterval,
            isPrepaid
        );
    }

    function testShouldRevertIfAssetDecimalsAreWrong() public {
        underlying.setDecimals(12);

        vm.expectRevert(UnsupportedDecimals.selector);
        strategy = new ApeLendingStrategyMock(
            address(vault),
            address(underlying),
            address(cToken),
            address(ops),
            address(nativeTokenPriceFeed),
            address(assetPriceFeed),
            minReportInterval,
            isPrepaid
        );
    }

    function testShouldRevertIfAssetAndCTokenUnderlyingAreNotSame() public {
        underlying = new ERC20Mock("Mock Token 2", "TKN2");

        vault = new VaultMock(
            address(underlying),
            rewards,
            defaultFee,
            defaultLPRRate,
            defaultFounderFee
        );
        vault.setFounders((address(vaultFounderToken)));

        vm.expectRevert(IncompatibleCTokenContract.selector);
        strategy = new ApeLendingStrategyMock(
            address(vault),
            address(underlying),
            address(cToken),
            address(ops),
            address(nativeTokenPriceFeed),
            address(assetPriceFeed),
            minReportInterval,
            isPrepaid
        );
    }

    function testShouldGiveFullAllowanceToDeps() public {
        uint256 routerAllowance = ERC20Mock(BANANA).allowance(
            address(strategy),
            PANCAKE_ROUTER
        );
        assertEq(routerAllowance, type(uint256).max);

        uint256 cTokenAllowance = underlying.allowance(
            address(strategy),
            address(cToken)
        );
        assertEq(cTokenAllowance, type(uint256).max);
    }

    function testShouldDisplayCorrectName() public {
        assertEq(strategy.name(), "TKN ApeLending Strategy");
    }

    function testShouldCalculateDepositedBalanceFromSnapshot(
        uint128 cTokenBalance,
        uint32 exchangeRate
    ) public {
        // Give the required funds to Actor
        underlying.mint(address(strategy), cTokenBalance);
        assertEq(underlying.balanceOf(address(strategy)), cTokenBalance);

        vm.prank(address(strategy));
        cToken.mint(cTokenBalance);
        cToken.setExchangeRate(exchangeRate);

        (uint256 shares, uint256 balance) = strategy.depositedBalanceSnapshot();
        assertEq(shares, cTokenBalance);
        assertEq(balance, (uint256(cTokenBalance) * exchangeRate) / 1e18);
    }

    function testShouldReturnDepositedBalance(uint192 balance) public {
        // Give the required funds to Actor
        underlying.mint(address(strategy), balance);
        assertEq(underlying.balanceOf(address(strategy)), balance);

        vm.prank(address(strategy));
        cToken.mint(balance);

        assertEq(balance, strategy.depositedBalance());
    }

    function testShouldReturnZeroEstimatedAccruedBananaPerBlockIfBalanceIsZero(
        uint32 exchangeRate
    ) public {
        cToken.setExchangeRate(exchangeRate);
        vm.prank(address(strategy));
        cToken.burn(cToken.balanceOf(address(strategy)));

        assertEq(strategy.estimatedAccruedBanana(), 0);
    }

    function testShouldReturnZeroEstimatedAccruedBananaPerBlockIfRateIsZero(
        uint32 balance
    ) public {
        // Give the required funds to Actor
        underlying.mint(address(strategy), balance);
        assertEq(underlying.balanceOf(address(strategy)), balance);

        cToken.setExchangeRate(0);
        vm.prank(address(strategy));
        cToken.mint(balance);

        assertEq(strategy.estimatedAccruedBanana(), 0);
    }

    function testShouldReturnZeroEstimatedAccruedBananaPerBlockIfTotalSupplyIsZero(
        uint128 cTokenBalance,
        uint32 exchangeRate,
        uint64 supplySpeed
    ) public {
        vm.assume(exchangeRate > 0);
        vm.assume(cTokenBalance > 0);
        vm.assume(supplySpeed > 0 && supplySpeed < 4e16);

        cToken.setExchangeRate(exchangeRate);

        rainMaker.setCompSupplySpeeds(supplySpeed);

        assertEq(strategy.estimatedAccruedBananaPerBlock(), 0);
    }

    function testShouldCalculateEstimatedAccruedBananaPerBlock(
        uint128 cTokenBalance,
        uint32 exchangeRate,
        uint192 totalSupply,
        uint64 supplySpeed
    ) public returns (uint256) {
        vm.assume(exchangeRate > 0);
        vm.assume(cTokenBalance > 0);
        vm.assume(totalSupply >= cTokenBalance);
        vm.assume(supplySpeed > 0 && supplySpeed < 4e16);

        // Simulate "vm.assume(totalSupply > 1e18)", avoiding "rejected too many inputs" error.
        (bool success, uint256 newTS) = SafeMath.tryAdd(1e18, totalSupply);
        if (success) {
            totalSupply = uint192(Math.min(newTS, type(uint192).max));
        }

        // Give the required funds to Actors
        underlying.mint(address(strategy), cTokenBalance);
        underlying.mint(address(this), totalSupply);

        cToken.setExchangeRate(exchangeRate);
        vm.prank(address(strategy));
        cToken.mint(cTokenBalance);

        vm.prank(address(this));
        cToken.mint(totalSupply - cTokenBalance);

        rainMaker.setCompSupplySpeeds(supplySpeed);

        uint256 deposited = (uint256(cTokenBalance) * exchangeRate) / 1e18;
        uint256 underlyingTotalSupply = (uint256(totalSupply) * exchangeRate) /
            1e18;
        uint256 expected = (deposited * supplySpeed) / underlyingTotalSupply;
        assertEq(strategy.estimatedAccruedBananaPerBlock(), expected);

        return expected;
    }

    function testShouldReturnZeroEstimatedAccruedBananaIfBlockAmountIsZero()
        public
    {
        assertEq(strategy.estimatedAccruedBananaPerBlock(), 0);
        assertEq(strategy.estimatedAccruedBanana(), 0);
    }

    function testShouldReturnZeroEstimatedAccruedBananaIfReportWasInCurrentBlock(
        uint128 cTokenBalance,
        uint32 exchangeRate,
        uint192 totalSupply,
        uint64 supplySpeed,
        uint64 blockTimestamp
    ) public {
        uint256 bananaPerBlock = testShouldCalculateEstimatedAccruedBananaPerBlock(
                cTokenBalance,
                exchangeRate,
                totalSupply,
                supplySpeed
            );
        vm.assume(bananaPerBlock > 0);

        vm.mockCall(
            address(vault),
            abi.encodeWithSelector(IVault(vault).lastReport.selector),
            abi.encode(blockTimestamp)
        );

        vm.warp(blockTimestamp);

        assertEq(strategy.estimatedAccruedBanana(), 0);
    }

    function testShouldCalculateEstimatedAccruedBanana(
        uint128 cTokenBalance,
        uint32 exchangeRate,
        uint192 totalSupply,
        uint64 supplySpeed,
        uint64 blockTimestamp,
        uint64 lastReportTimestamp
    ) public returns (uint256) {
        vm.assume(lastReportTimestamp < blockTimestamp);

        uint256 bananaPerBlock = testShouldCalculateEstimatedAccruedBananaPerBlock(
                cTokenBalance,
                exchangeRate,
                totalSupply,
                supplySpeed
            );
        vm.assume(bananaPerBlock > 0);

        vm.mockCall(
            address(vault),
            abi.encodeWithSelector(IVault(vault).lastReport.selector),
            abi.encode(lastReportTimestamp)
        );

        vm.warp(blockTimestamp);

        uint256 blocks = (blockTimestamp - lastReportTimestamp) /
            SECONDS_PER_BLOCK;
        uint256 expected = bananaPerBlock * blocks;
        assertEq(strategy.estimatedAccruedBanana(), expected);

        return expected;
    }

    function testShouldReturnCorrectCurrentBananaBalance(uint256 bananaBalance)
        public
        returns (uint256)
    {
        ERC20Mock(BANANA).mint(address(strategy), bananaBalance);
        assertEq(strategy.currentBananaBalance(), bananaBalance);

        return bananaBalance;
    }

    function testShouldReturnZeroTotalBananaAssetBalanceIfNoBanana() public {
        assertEq(strategy.estimatedAccruedBanana(), 0);
        assertEq(strategy.currentBananaBalance(), 0);

        assertEq(strategy.totalBananaBalanceInAsset(), 0);
    }

    function testShouldCalculateTotalBananaBalanceInAsset(
        uint128 cTokenBalance,
        uint32 exchangeRate,
        uint192 totalSupply,
        uint64 supplySpeed,
        uint64 blockTimestamp,
        uint64 lastReportTimestamp,
        uint128 bananaBalance
    ) public {
        uint256 currentBananaBalance = testShouldReturnCorrectCurrentBananaBalance(
                bananaBalance
            );
        vm.assume(currentBananaBalance > 0);

        uint256 estimatedAccruedBanana = testShouldCalculateEstimatedAccruedBanana(
                cTokenBalance,
                exchangeRate,
                totalSupply,
                supplySpeed,
                blockTimestamp,
                lastReportTimestamp
            );
        vm.assume(estimatedAccruedBanana > 0);

        // Let's assume that the price of BANANA is equal to asset's price
        uint256[] memory amounts = new uint256[](1);
        amounts[0] = currentBananaBalance + estimatedAccruedBanana;
        vm.mockCall(
            address(PANCAKE_ROUTER),
            abi.encodeWithSelector(
                IPancakeRouter(PANCAKE_ROUTER).getAmountsOut.selector
            ),
            abi.encode(amounts)
        );

        uint256 expected = (amounts[0] * REWARD_ESTIMATION_ACCURACY) / 100;
        assertEq(strategy.totalBananaBalanceInAsset(), expected);
    }

    function testShouldConstructCorrectSwapPath() public {
        address addressA = vm.addr(111);
        address addressB = vm.addr(222);

        address[] memory addresses = new address[](3);
        addresses[0] = addressA;
        addresses[1] = WBNB;
        addresses[2] = addressB;
        assertEq(strategy.tokenSwapPath(addressA, addressB), addresses);

        addresses = new address[](2);
        addresses[0] = WBNB;
        addresses[1] = addressB;
        assertEq(strategy.tokenSwapPath(WBNB, addressB), addresses);

        addresses = new address[](2);
        addresses[0] = addressA;
        addresses[1] = WBNB;
        assertEq(strategy.tokenSwapPath(addressA, WBNB), addresses);
    }

    function testShouldClaimBanana() public {
        vm.expectEmit(true, true, true, true);
        rainMaker.emitClaimCompCalled(address(strategy), address(cToken));

        strategy.claimBanana();
    }

    function testShouldNotSwapBananaToAssetIfBalanceLessThanMinimumAmount(
        uint128 bananaBalance,
        uint128 minBananaToSwap
    ) public {
        vm.assume(bananaBalance < minBananaToSwap);

        ERC20Mock(BANANA).mint(address(strategy), bananaBalance);
        strategy.setMinBananaToSell(minBananaToSwap);

        assertEq(pancakeRouter.swapCalled(), false);
        strategy.swapBananaToAsset();
        assertEq(pancakeRouter.swapCalled(), false);
    }

    function testShouldSwapBananaToAsset(
        uint128 bananaBalance,
        uint128 minBananaToSwap
    ) public {
        vm.assume(bananaBalance >= minBananaToSwap);

        ERC20Mock(BANANA).mint(address(strategy), bananaBalance);
        strategy.setMinBananaToSell(minBananaToSwap);

        vm.expectEmit(true, true, true, true);
        pancakeRouter.emitSwapExactTokensForTokens(
            bananaBalance,
            0,
            strategy.tokenSwapPath(BANANA, address(underlying)),
            address(strategy),
            block.timestamp
        );

        assertEq(pancakeRouter.swapCalled(), false);
        strategy.swapBananaToAsset();
        assertEq(pancakeRouter.swapCalled(), true);
    }

    function testHarvestIfThereIsNoPosition(
        uint128 outstandingDebt,
        uint128 assetBalance
    ) public {
        underlying.mint(address(strategy), assetBalance);

        assertEq(cToken.balanceOf(address(strategy)), 0);
        assertEq(underlying.balanceOf(address(strategy)), assetBalance);

        (uint256 profit, uint256 loss, uint256 debtPayment) = strategy.harvest(
            outstandingDebt
        );

        assertEq(profit, 0);
        assertEq(loss, 0);
        assertEq(debtPayment, Math.min(outstandingDebt, assetBalance));
    }

    function testShouldClaimAndSwapBananaOnHarvest(
        uint128 outstandingDebt,
        uint128 assetBalance,
        uint128 cTokenBalance,
        uint128 bananaBalance
    ) public {
        vm.assume(cTokenBalance > 0);

        // Give the required funds to Actor
        underlying.mint(address(strategy), cTokenBalance);
        assertEq(underlying.balanceOf(address(strategy)), cTokenBalance);

        vm.prank(address(strategy));
        cToken.mint(cTokenBalance);
        underlying.mint(address(strategy), assetBalance);

        strategy.setMinBananaToSell(bananaBalance);
        ERC20Mock(BANANA).mint(address(strategy), bananaBalance);

        assertEq(cToken.balanceOf(address(strategy)), cTokenBalance);
        assertEq(underlying.balanceOf(address(strategy)), assetBalance);

        vm.expectEmit(true, true, true, true);
        rainMaker.emitClaimCompCalled(address(strategy), address(cToken));

        vm.expectEmit(true, true, true, true);
        pancakeRouter.emitSwapExactTokensForTokens(
            bananaBalance,
            0,
            strategy.tokenSwapPath(BANANA, address(underlying)),
            address(strategy),
            block.timestamp
        );

        strategy.harvest(outstandingDebt);
    }

    function testHarvestWithLossCase(
        uint128 outstandingDebt,
        uint128 assetBalance,
        uint128 cTokenBalance,
        uint128 currentDebt
    ) public {
        vm.assume(cTokenBalance > 0);

        // CToken balance is equal to CToken underlying balance (for testing purposes)
        uint256 balance = uint256(assetBalance) + cTokenBalance;

        // Ensure we have no gain on this harvest
        vm.assume(balance <= currentDebt);

        _setupHarvestData(assetBalance, cTokenBalance, currentDebt);

        (uint256 profit, uint256 loss, uint256 debtPayment) = strategy.harvest(
            outstandingDebt
        );

        assertEq(profit, 0);
        assertEq(loss, currentDebt - balance);
        assertEq(debtPayment, Math.min(outstandingDebt, assetBalance));
    }

    function testHarvestWithProfitCaseWhenActualProfitGreaterThanFreeAssets(
        uint128 outstandingDebt,
        uint128 assetBalance,
        uint128 cTokenBalance,
        uint128 currentDebt
    ) public {
        vm.assume(cTokenBalance > 0);

        // CToken balance is equal to CToken underlying balance (for testing purposes, see CTokenMock)
        uint256 balance = uint256(assetBalance) + cTokenBalance;

        // Ensure we have some profit on this harvest
        vm.assume(balance > currentDebt);

        // Ensure that the profit is greater than the amount of free assets
        uint256 profit = uint256(balance) - currentDebt;
        vm.assume(assetBalance < profit);

        _setupHarvestData(assetBalance, cTokenBalance, currentDebt);

        uint256 loss;
        uint256 debtPayment;
        uint256 expectAmountToredeem = profit - assetBalance;

        vm.expectEmit(true, true, true, true);
        emit WithdrawnFromProtocol(
            expectAmountToredeem,
            cTokenBalance,
            cTokenBalance,
            cTokenBalance - expectAmountToredeem,
            cTokenBalance - expectAmountToredeem,
            expectAmountToredeem
        );
        (profit, loss, debtPayment) = strategy.harvest(outstandingDebt);

        uint256 expectedAssetsBalanceAfter = assetBalance + expectAmountToredeem;

        uint256 expectedDebtPayment = Math.min(outstandingDebt, expectedAssetsBalanceAfter);
        assertEq(loss, 0);
        assertEq(debtPayment, expectedDebtPayment);
        assertEq(profit, expectedAssetsBalanceAfter - expectedDebtPayment);
    }

    function testHarvestWithProfitCaseWhenFreeAssetsGreaterThanProfitAndDebt(
        uint128 outstandingDebt,
        uint128 assetBalance,
        uint128 cTokenBalance,
        uint128 currentDebt
    ) public {
        vm.assume(cTokenBalance > 0);

        // CToken balance is equal to CToken underlying balance (for testing purposes, see CTokenMock)
        uint256 balance = uint256(assetBalance) + cTokenBalance;

        // Ensure we have some profit on this harvest
        vm.assume(balance > currentDebt);

        // Ensure that the free assets amount is greater than the profit and current debt
        uint256 profit = uint256(balance) - currentDebt;
        vm.assume(assetBalance > profit + outstandingDebt);

        _setupHarvestData(assetBalance, cTokenBalance, currentDebt);

        (uint256 harvestProfit, uint256 loss, uint256 debtPayment) = strategy
            .harvest(outstandingDebt);

        assertEq(loss, 0);
        assertEq(debtPayment, outstandingDebt);
        assertEq(harvestProfit, profit);
    }

    function testHarvestWithProfitCaseWhenFreeAssetsGreaterThanProfitButLessThanProfitAndDebt(
        uint128 outstandingDebt,
        uint128 assetBalance,
        uint128 cTokenBalance,
        uint128 currentDebt
    ) public {
        vm.assume(cTokenBalance > 0);

        // CToken balance is equal to CToken underlying balance (for testing purposes, see CTokenMock)
        uint256 balance = uint256(assetBalance) + cTokenBalance;

        // Ensure we have some profit on this harvest
        vm.assume(balance > currentDebt);

        // Ensure that the free assets amount is greater than the profit but less than this profit and current debt
        uint256 profit = uint256(balance) - currentDebt;
        vm.assume(
            assetBalance > profit && assetBalance <= profit + outstandingDebt
        );

        _setupHarvestData(assetBalance, cTokenBalance, currentDebt);

        (uint256 harvestProfit, uint256 loss, uint256 debtPayment) = strategy
            .harvest(outstandingDebt);

        assertEq(loss, 0);
        assertEq(debtPayment, assetBalance - profit);
        assertEq(harvestProfit, profit);
    }

    function testShouldAdjustPositionWhenNotPaused(uint256 outstandingDebt)
        public
    {
        underlying.setForbiddenAddress(address(strategy));

        vm.expectRevert("CALLED");

        strategy.adjustPosition(outstandingDebt);
    }

    function testShouldNotAdjustPositionWhenPaused(uint256 outstandingDebt)
        public
    {
        strategy.shutdown();

        underlying.setForbiddenAddress(address(strategy));

        uint256 cTokenBalanceBefore = cToken.balanceOf(address(strategy));

        strategy.adjustPosition(outstandingDebt);

        assertEq(cToken.balanceOf(address(strategy)), cTokenBalanceBefore);
    }

    /**
        If the current balance of assets under the strategy's contract is less than the amount of debt that the strategy must repay,
        then the strategy must liquidate its asset position.
    */
    function testShouldLiquidatePositionIfBalanceLessThanDebt(
        uint128 outstandingDebt,
        uint128 assetBalance,
        uint128 cTokenBalance
    ) public {
        vm.assume(cTokenBalance > 1);
        vm.assume(assetBalance < outstandingDebt);

        // CToken balance is equal to CToken underlying balance (for testing purposes, see CTokenMock)
        uint128 cTokenUnderlyingBalance = cTokenBalance;
        _setupHarvestData(assetBalance, cTokenUnderlyingBalance, 0);

        uint256 cTokenBalanceBefore = cToken.balanceOf(address(strategy));

        uint256 amountToWithdraw = outstandingDebt - assetBalance;
        uint256 expectedWithdrawn = MathUpgradeable.min(amountToWithdraw, cTokenUnderlyingBalance);

        // Check if strategy's position liquidation was called
        vm.expectEmit(true, true, true, true);
        strategy.emitLiquidatePositionCalled(amountToWithdraw);

        // Strategy should liquidate the position if the balance of assets on the strategy contract is lower than what the vault wants to withdraw.
        if (assetBalance < amountToWithdraw) {
            vm.expectEmit(true, true, true, true);
            emit WithdrawnFromProtocol(
                expectedWithdrawn,
                cTokenBalanceBefore,
                cTokenUnderlyingBalance,
                cTokenBalanceBefore - expectedWithdrawn,
                cTokenUnderlyingBalance - expectedWithdrawn,
                expectedWithdrawn
            );
        }

        strategy.adjustPosition(outstandingDebt);

        if (assetBalance < amountToWithdraw) {
            assertEq(underlying.balanceOf(address(strategy)), expectedWithdrawn + assetBalance);
            assertEq(cToken.balanceOf(address(strategy)), cTokenUnderlyingBalance - expectedWithdrawn);
        } else {
            assertEq(underlying.balanceOf(address(strategy)), assetBalance);
            assertEq(cToken.balanceOf(address(strategy)), cTokenBalance);
        }
    }

    function testShouldMintCTokenIfBalanceGreaterThanDebt(
        uint128 outstandingDebt,
        uint128 assetBalance
    ) public {
        vm.assume(assetBalance > outstandingDebt);

        _setupHarvestData(assetBalance, 0, 0);

        vm.expectCall(
            address(cToken),
            abi.encodeCall(cToken.mint, assetBalance - outstandingDebt)
        );

        vm.expectEmit(true, true, true, false);
        emit DepositedToProtocol(assetBalance - outstandingDebt, 0, 0, 0, 0);

        strategy.adjustPosition(outstandingDebt);

        assertEq(underlying.balanceOf(address(cToken)), assetBalance - outstandingDebt);
    }

    function testShouldNotLiquidatePositionIfHasSufficeBalance(
        uint128 assets,
        uint128 assetBalance
    ) public {
        vm.assume(assetBalance >= assets);

        _setupHarvestData(assetBalance, 0, 0);

        (uint256 liquidatedAmount, uint256 loss) = strategy.liquidatePosition(
            assets
        );
        assertEq(loss, 0);
        assertEq(liquidatedAmount, assets);
    }

    function testShouldLiquidatePosition(
        uint128 assets,
        uint128 deposits,
        uint128 assetBalance
    ) public {
        vm.assume(assetBalance < assets);

        _setupHarvestData(assetBalance, deposits, 0);

        (uint256 liquidatedAmount, uint256 loss) = strategy.liquidatePosition(
            assets
        );

        uint256 amountToRedeem = MathUpgradeable.min(deposits, assets);
        assertEq(loss, assets - amountToRedeem);
        assertEq(liquidatedAmount, amountToRedeem);
    }

    function testShouldLiquidateAll(uint128 deposits) public {
        _setupHarvestData(0, deposits, 0);

        uint256 amountFreed = strategy.liquidateAllPositions();
        assertEq(amountFreed, deposits);
    }

    function testShouldLiquidateAllWithScumLendingProtocol(uint128 deposits) public {
        vm.assume(deposits > 100);
        uint256 scumLoss = deposits / 10;

        _setupHarvestData(0, deposits, 0);

        // after setting scumLoss the strategy returns less than requested and liquidateAllPositions must return actual value
        cToken.setFraudProtocolLoss(scumLoss);
        uint256 amountFreed = strategy.liquidateAllPositions();
        // strategy must report real claimed amount regardless documented debt
        assertEq(amountFreed, deposits - scumLoss);
    }

    function _setupHarvestData(
        uint128 assetBalance,
        uint128 cTokenBalance,
        uint128 currentDebt
    ) internal {
        // Give the required funds to Actor as prerequisite to mint cToken
        // because cTokenBalance will be transferred to cToken
        underlying.mint(address(strategy), cTokenBalance);
        vm.prank(address(strategy));
        cToken.mint(cTokenBalance);

        // CToken balance is equal to CToken underlying balance (for testing purposes, see CTokenMock)        
        assertEq(cToken.balanceOfUnderlying(address(strategy)), cTokenBalance);
        assertEq(cToken.balanceOf(address(strategy)), cTokenBalance);

        underlying.mint(address(strategy), assetBalance);
        assertEq(underlying.balanceOf(address(strategy)), assetBalance);

        vm.mockCall(
            address(vault),
            abi.encodeWithSelector(IVault(vault).currentDebt.selector),
            abi.encode(currentDebt)
        );
    }

    function testShutdownStrategyForSignificantLoss(uint256 amount, uint256 loss) public {
        vm.assume(amount > 100 && amount < 10 ** 22 && loss > amount / 4 && amount > loss);

        // Give the required funds to Actor
        underlying.mint(alice, amount);
        assertEq(underlying.balanceOf(alice), amount);

        // Allow to vault to take the Actor's assets
        vm.prank(alice);
        underlying.increaseAllowance(address(vault), type(uint256).max);

        // Actor deposits funds to the vault
        vm.prank(alice);
        vault.deposit(amount);

        assertEq(vault.freeAssets(), amount);
        assertEq(strategy.freeAssets(), 0);
        assertEq(strategy.depositedBalance(), 0);

        // distribute funds to strategy
        strategy.callWork();

        assertEq(strategy.depositedBalance(), amount);
        assertEq(vault.freeAssets(), 0);
        assertEq(strategy.freeAssets(), 0);
        assertEq(strategy.paused(), false);

        // check if shutdown triggered
        vm.expectEmit(true, true, true, true);
        strategy.emitHealthCheckTriggered(2);

        cToken.setLoss(loss);
        strategy.callWork();

        // check if not lost money returned back to vault after shutdown the strategy
        assertEq(vault.freeAssets(), amount - loss);
        assertEq(strategy.freeAssets(), 0);
        assertEq(strategy.paused(), true);
    }
}
