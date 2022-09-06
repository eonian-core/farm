// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "forge-std/Test.sol";
import "forge-std/console.sol";

import "./mocks/VaultMock.sol";
import "./mocks/ERC20Mock.sol";
import "./mocks/StrategyMock.sol";
import "./mocks/OpsMock.sol";
import "./mocks/BaseStrategyMock.sol";
import "./mocks/AggregatorV3Mock.sol";

import "contracts/IVault.sol";
import "contracts/structures/PriceConverter.sol";

contract BaseStrategyTest is Test {
    using PriceConverter for AggregatorV3Mock;

    ERC20Mock underlying;
    VaultMock vault;
    OpsMock ops;

    AggregatorV3Mock nativeTokenPriceFeed;
    AggregatorV3Mock assetPriceFeed;

    BaseStrategyMock baseStrategy;

    address rewards = vm.addr(1);
    address alice = vm.addr(2);
    address culprit = vm.addr(333);

    uint256 defaultFee = 1000;
    uint256 defaultLPRRate = 10**18;

    uint256 minReportInterval = 3600;
    bool isPrepaid = false;

    function setUp() public {
        underlying = new ERC20Mock("Mock Token", "TKN");

        vault = new VaultMock(
            address(underlying),
            rewards,
            defaultFee,
            defaultLPRRate
        );

        ops = new OpsMock();
        ops.setGelato(payable(alice));

        nativeTokenPriceFeed = new AggregatorV3Mock();
        nativeTokenPriceFeed.setDecimals(8);
        nativeTokenPriceFeed.setPrice(274 * 1e8);

        assetPriceFeed = new AggregatorV3Mock();
        assetPriceFeed.setDecimals(8);
        assetPriceFeed.setPrice(1e8);

        baseStrategy = new BaseStrategyMock(
            vault,
            address(ops),
            minReportInterval,
            isPrepaid,
            address(nativeTokenPriceFeed),
            address(assetPriceFeed)
        );
        vault.addStrategy(address(baseStrategy), 10_000);
    }

    function testRevertIfPriceFeedDecimalsAreDifferent() public {
        nativeTokenPriceFeed = new AggregatorV3Mock();
        nativeTokenPriceFeed.setDecimals(8);
        nativeTokenPriceFeed.setPrice(274 * 1e8);

        assetPriceFeed = new AggregatorV3Mock();
        assetPriceFeed.setDecimals(18);
        assetPriceFeed.setPrice(1e18);

        vm.expectRevert(IncompatiblePriceFeeds.selector);

        baseStrategy = new BaseStrategyMock(
            vault,
            address(ops),
            minReportInterval,
            isPrepaid,
            address(nativeTokenPriceFeed),
            address(assetPriceFeed)
        );
    }

    function testShouldTakeVaultAsset() public {
        address assetStrategy = address(baseStrategy.asset());
        address assetVault = address(IVault(vault).asset());
        assertEq(assetStrategy, assetVault);
    }

    function testGrantFullAssetsAccessToVault() public {
        uint256 allowance = underlying.allowance(
            address(baseStrategy),
            address(vault)
        );
        assertEq(allowance, type(uint256).max);
    }

    function testProperHarvestFunctionCalledOnWork(bool paused) public {
        if (paused) {
            baseStrategy.shutdown();
        }

        vm.expectEmit(true, true, true, true);
        if (paused) {
            baseStrategy.emitHarvestAfterShutdownCalled();
        } else {
            baseStrategy.emitHarvestCalled();
        }

        baseStrategy.callWork();
    }

    function testProperReportFunctionCalledOnWork() public {
        vm.mockCall(
            address(vault),
            abi.encodeWithSelector(vault.reportPositiveDebtManagement.selector),
            abi.encode()
        );

        vm.mockCall(
            address(vault),
            abi.encodeWithSelector(vault.reportNegativeDebtManagement.selector),
            abi.encode()
        );

        baseStrategy.setHarvestProfit(1e8);
        vm.expectCall(
            address(vault),
            abi.encodeCall(vault.reportPositiveDebtManagement, (1e8, 0))
        );
        baseStrategy.callWork();

        baseStrategy.setHarvestProfit(0);
        baseStrategy.setHarvestLoss(1e8);
        vm.expectCall(
            address(vault),
            abi.encodeCall(vault.reportNegativeDebtManagement, (1e8, 0))
        );
        baseStrategy.callWork();
    }

    function testShouldTakeIntoAccountTotalDebtWhenAdjustPosition(
        uint192 estimatedTotalAssets,
        uint192 outstandingDebt,
        uint192 debtRatio,
        bool shuttedDown
    ) public {
        vm.assume(outstandingDebt < estimatedTotalAssets);

        baseStrategy.setEstimatedTotalAssets(estimatedTotalAssets);

        vm.mockCall(
            address(vault),
            abi.encodeWithSelector(vault.reportPositiveDebtManagement.selector),
            abi.encode()
        );

        vm.mockCall(
            address(vault),
            abi.encodeWithSelector(vault.reportNegativeDebtManagement.selector),
            abi.encode()
        );

        vm.mockCall(
            address(vault),
            abi.encodeWithSelector(vault.outstandingDebt.selector),
            abi.encode(outstandingDebt)
        );

        vm.mockCall(
            address(vault),
            abi.encodeWithSelector(IVault(vault).currentDebtRatio.selector),
            abi.encode(debtRatio)
        );

        vm.mockCall(
            address(vault),
            abi.encodeWithSelector(IVault(vault).paused.selector),
            abi.encode(shuttedDown)
        );

        vm.expectEmit(true, true, true, true);

        baseStrategy.emitAjustPositionCalled(
            (shuttedDown || debtRatio == 0)
                ? estimatedTotalAssets
                : outstandingDebt
        );

        baseStrategy.callWork();
    }

    function testCanWorkIfVaultIsDeactivated() public {
        vm.mockCall(
            address(vault),
            abi.encodeWithSelector(IVault(vault).isActivated.selector),
            abi.encode(false)
        );

        assertFalse(baseStrategy.callCanWork());
    }

    function testCanWorkIfDebtGreaterThanThreshold(
        uint256 outstandingDebt,
        uint192 threshold,
        bool passThreshold
    ) public {
        vm.assume(outstandingDebt < threshold);

        if (passThreshold) {
            outstandingDebt = uint256(threshold) + 1;
        }

        vm.mockCall(
            address(vault),
            abi.encodeWithSelector(IVault(vault).isActivated.selector),
            abi.encode(true)
        );

        vm.mockCall(
            address(vault),
            abi.encodeWithSelector(IVault(vault).outstandingDebt.selector),
            abi.encode(outstandingDebt)
        );

        baseStrategy.setDebtThreshold(threshold);

        assertEq(baseStrategy.callCanWork(), passThreshold);
    }

    function testCanWorkIfStrategyHasLoss(
        uint192 estimatedTotalAssets,
        uint192 currentDebt,
        uint192 debtThreshold
    ) public {
        vm.assume(estimatedTotalAssets + uint256(debtThreshold) < currentDebt);

        baseStrategy.setEstimatedTotalAssets(estimatedTotalAssets);

        vm.mockCall(
            address(vault),
            abi.encodeWithSelector(IVault(vault).currentDebt.selector),
            abi.encode(currentDebt)
        );

        baseStrategy.setDebtThreshold(debtThreshold);

        assertEq(baseStrategy.callCanWork(), true);
    }

    function testCheckGasPriceAgainstProfit(
        uint128 availableCredit,
        uint192 profitFactor,
        uint192 estimatedWorkGas,
        uint128 profit
    ) public {
        vm.assume(profitFactor <= 1000);
        vm.assume(estimatedWorkGas <= 300_000);

        baseStrategy.setEstimatedWorkGas(estimatedWorkGas);
        baseStrategy.setProfitFactor(profitFactor);

        vm.mockCall(
            address(vault),
            abi.encodeWithSelector(IVault(vault).availableCredit.selector),
            abi.encode(availableCredit)
        );

        bool given = baseStrategy.checkGasPriceAgainstProfit(profit);

        uint256 gasCost = nativeTokenPriceFeed.convertAmount(tx.gasprice, 18) *
            estimatedWorkGas;

        bool expect = profitFactor * gasCost <
            assetPriceFeed.convertAmount(profit + uint256(availableCredit), 18);

        assertEq(given, expect);
    }

    function testRevertOnWithdrawIfCallerIsNotAVault(uint256 assets) public {
        vm.expectRevert(CallerIsNotAVault.selector);
        baseStrategy.withdraw(assets);
    }

    function testLiquidateAndSendOnWithdraw(uint256 assets) public {
        underlying.mint(address(baseStrategy), assets);

        baseStrategy.emitLiquidatePositionCalled(assets);

        vm.prank(address(vault));
        baseStrategy.withdraw(assets);

        assertEq(underlying.balanceOf(address(vault)), assets);
    }

    function testRevertOnShutdownIfCallerIsNotAnOwner() public {
        vm.expectRevert(bytes("Ownable: caller is not the owner"));

        vm.prank(address(culprit));
        baseStrategy.shutdown();
    }

    function testPauseAndRevokingOnShutdown() public {
        vm.expectEmit(true, true, true, true);
        vault.emitStrategyRevokedEvent(address(baseStrategy));

        baseStrategy.shutdown();

        assertTrue(baseStrategy.paused());
    }

    function testRevertOnSetDebtThresholdIfCallerIsNotAnOwner(
        uint256 debtThreshold
    ) public {
        vm.expectRevert(bytes("Ownable: caller is not the owner"));

        vm.prank(address(culprit));
        baseStrategy.setDebtThreshold(debtThreshold);
    }

    function testShouldSetDebtThreshold(uint256 debtThreshold) public {
        vm.expectEmit(true, true, true, true);
        baseStrategy.emitDebtThresholdUpdated(debtThreshold);

        baseStrategy.setDebtThreshold(debtThreshold);

        assertEq(baseStrategy.debtThreshold(), debtThreshold);
    }

    function testRevertOnSetEstimatedWorkGasIfCallerIsNotAnOwner(
        uint256 estimatedWorkGas
    ) public {
        vm.expectRevert(bytes("Ownable: caller is not the owner"));

        vm.prank(address(culprit));
        baseStrategy.setEstimatedWorkGas(estimatedWorkGas);
    }

    function testShouldSetEstimatedWorkGas(uint256 estimatedWorkGas) public {
        vm.expectEmit(true, true, true, true);
        baseStrategy.emitEstimatedWorkGasUpdated(estimatedWorkGas);

        baseStrategy.setEstimatedWorkGas(estimatedWorkGas);

        assertEq(baseStrategy.estimatedWorkGas(), estimatedWorkGas);
    }

    function testRevertOnSetProfitFactorIfCallerIsNotAnOwner(
        uint256 profitFactor
    ) public {
        vm.expectRevert(bytes("Ownable: caller is not the owner"));

        vm.prank(address(culprit));
        baseStrategy.setProfitFactor(profitFactor);
    }

    function testShouldSetProfitFactor(uint256 profitFactor) public {
        vm.expectEmit(true, true, true, true);
        baseStrategy.emitUpdatedProfitFactor(profitFactor);

        baseStrategy.setProfitFactor(profitFactor);

        assertEq(baseStrategy.profitFactor(), profitFactor);
    }

    function testShouldRealiseLossIfFreedLowerThanDebt(
        uint256 outstandingDebt,
        uint256 freed
    ) public {
        vm.assume(freed < outstandingDebt);

        baseStrategy.setLiquidateAllPositionsReturn(freed);

        (uint256 profit, uint256 loss, uint256 debtPayment) = baseStrategy
            .harvestAfterShutdown(outstandingDebt);

        assertEq(loss, outstandingDebt - freed);
        assertEq(profit, 0);
        assertEq(debtPayment, outstandingDebt - loss);
    }

    function testShouldGainProfitIfFreedGreaterOrEqualToDebt(
        uint256 outstandingDebt,
        uint256 freed
    ) public {
        vm.assume(freed >= outstandingDebt);

        baseStrategy.setLiquidateAllPositionsReturn(freed);

        (uint256 profit, uint256 loss, uint256 debtPayment) = baseStrategy
            .harvestAfterShutdown(outstandingDebt);

        assertEq(loss, 0);
        assertEq(profit, freed - outstandingDebt);
        assertEq(debtPayment, outstandingDebt);
    }
}
