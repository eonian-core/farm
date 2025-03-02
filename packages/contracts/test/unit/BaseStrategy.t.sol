// SPDX-License-Identifier: AGPL-3.0
pragma solidity ^0.8.0;

import 'forge-std/Test.sol';
import 'forge-std/console.sol';

import './mocks/VaultMock.sol';
import './mocks/ERC20Mock.sol';
import './mocks/StrategyMock.sol';
import './mocks/OpsMock.sol';
import './mocks/BaseStrategyMock.sol';
import './mocks/AggregatorV3Mock.sol';
import './mocks/VaultFounderTokenMock.sol';
import './mocks/LossRatioHealthCheckMock.sol';

import 'contracts/IVault.sol';
import 'contracts/structures/PriceConverter.sol';
import 'contracts/automation/Job.sol';
import 'contracts/healthcheck/IHealthCheck.sol';

import 'contracts/strategies/CTokenBaseStrategy.sol';

import './helpers/TestWithERC1820Registry.sol';

contract BaseStrategyTest is TestWithERC1820Registry {
  using PriceConverter for AggregatorV3Mock;

  ERC20Mock underlying;
  VaultMock vault;
  OpsMock ops;
  VaultFounderTokenMock vaultFounderToken;

  AggregatorV3Mock nativeTokenPriceFeed;
  AggregatorV3Mock assetPriceFeed;

  BaseStrategyMock baseStrategy;
  IHealthCheck healthCheck;

  address rewards = vm.addr(1);
  address alice = vm.addr(2);
  address culprit = vm.addr(333);

  uint256 defaultFee = 1000;
  uint256 defaultLPRRate = 10 ** 18;
  uint256 defaultFounderFee = 100;

  uint256 minReportInterval = 3600;
  bool isPrepaid = false;

  function setUp() public {
    underlying = new ERC20Mock('Mock Token', 'TKN');
    vaultFounderToken = new VaultFounderTokenMock(3, 12_000, 200, vault);

    vault = new VaultMock(address(underlying), rewards, defaultFee, defaultLPRRate, defaultFounderFee);
    vaultFounderToken.setVault(vault);

    ops = new OpsMock();
    ops.setGelato(payable(alice));

    nativeTokenPriceFeed = new AggregatorV3Mock();
    nativeTokenPriceFeed.setDecimals(8);
    nativeTokenPriceFeed.setPrice(274 * 1e8);

    assetPriceFeed = new AggregatorV3Mock();
    assetPriceFeed.setDecimals(8);
    assetPriceFeed.setPrice(1e8);

    healthCheck = new LossRatioHealthCheckMock(1_500);

    baseStrategy = new BaseStrategyMock(
      vault,
      IERC20Upgradeable(address(underlying)),
      ops,
      minReportInterval,
      isPrepaid,
      nativeTokenPriceFeed,
      assetPriceFeed,
      address(healthCheck)
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
      IERC20Upgradeable(address(underlying)),
      ops,
      minReportInterval,
      isPrepaid,
      nativeTokenPriceFeed,
      assetPriceFeed,
      address(healthCheck)
    );
  }

  function testShouldTakeVaultAsset() public {
    address assetStrategy = address(baseStrategy.asset());
    address assetVault = address(IVault(vault).asset());
    assertEq(assetStrategy, assetVault);
  }

  function testGrantFullAssetsAccessToVault() public {
    uint256 allowance = underlying.allowance(address(baseStrategy), address(vault));
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
    vm.mockCall(address(vault), abi.encodeWithSelector(vault.reportPositiveDebtManagement.selector), abi.encode());

    vm.mockCall(address(vault), abi.encodeWithSelector(vault.reportNegativeDebtManagement.selector), abi.encode());

    baseStrategy.setHarvestProfit(1e8);
    vm.expectCall(address(vault), abi.encodeCall(vault.reportPositiveDebtManagement, (1e8, 0)));
    baseStrategy.callWork();

    // loss less than debt and lossRation so should allow to finalize loss
    baseStrategy.setHarvestProfit(0);
    baseStrategy.setHarvestLoss(1e8);
    vm.expectCall(address(vault), abi.encodeCall(vault.reportNegativeDebtManagement, (1e8, 0)));
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

    vm.mockCall(address(vault), abi.encodeWithSelector(vault.reportPositiveDebtManagement.selector), abi.encode());

    vm.mockCall(address(vault), abi.encodeWithSelector(vault.reportNegativeDebtManagement.selector), abi.encode());

    vm.mockCall(address(vault), abi.encodeWithSelector(vault.outstandingDebt.selector), abi.encode(outstandingDebt));

    vm.mockCall(address(vault), abi.encodeWithSelector(IVault(vault).currentDebtRatio.selector), abi.encode(debtRatio));

    vm.mockCall(address(vault), abi.encodeWithSelector(IVault(vault).paused.selector), abi.encode(shuttedDown));

    vm.expectEmit(true, true, true, true);

    baseStrategy.emitAjustPositionCalled((shuttedDown || debtRatio == 0) ? estimatedTotalAssets : outstandingDebt);

    baseStrategy.callWork();
  }

  function testCanWorkIfVaultIsDeactivated() public {
    vm.mockCall(address(vault), abi.encodeWithSelector(IVault(vault).isActivated.selector), abi.encode(false));

    (bool _canWork, ) = baseStrategy.callCanWork();
    assertFalse(_canWork);
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

    vm.mockCall(address(vault), abi.encodeWithSelector(IVault(vault).isActivated.selector), abi.encode(true));

    vm.mockCall(
      address(vault),
      abi.encodeWithSelector(IVault(vault).outstandingDebt.selector),
      abi.encode(outstandingDebt)
    );

    baseStrategy.setDebtThreshold(threshold);

    (bool _canWork, ) = baseStrategy.callCanWork();
    assertEq(_canWork, passThreshold);
  }

  function testCanWorkIfStrategyHasLoss(
    uint192 estimatedTotalAssets,
    uint192 currentDebt,
    uint192 debtThreshold
  ) public {
    vm.assume(estimatedTotalAssets + uint256(debtThreshold) < currentDebt);

    baseStrategy.setEstimatedTotalAssets(estimatedTotalAssets);

    vm.mockCall(address(vault), abi.encodeWithSelector(IVault(vault).currentDebt.selector), abi.encode(currentDebt));

    baseStrategy.setDebtThreshold(debtThreshold);

    (bool _canWork, ) = baseStrategy.callCanWork();
    assertEq(_canWork, true);
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

    uint256 gasCost = nativeTokenPriceFeed.convertAmount(tx.gasprice, 18) * estimatedWorkGas;

    bool expect = profitFactor * gasCost < assetPriceFeed.convertAmount(profit + uint256(availableCredit), 18);

    assertEq(given, expect);
  }

  function testRevertOnWithdrawIfCallerIsNotAVault(uint256 assets) public {
    vm.expectRevert(CallerIsNotALender.selector);
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
    vm.expectRevert(bytes('Ownable: caller is not the owner'));

    vm.prank(address(culprit));
    baseStrategy.shutdown();
  }

  function testPauseAndRevokingOnShutdown() public {
    vm.expectEmit(true, true, true, true);
    vault.emitStrategyRevokedEvent(address(baseStrategy));

    baseStrategy.shutdown();

    assertTrue(baseStrategy.paused());
  }

  function testRevertOnSetDebtThresholdIfCallerIsNotAnOwner(uint256 debtThreshold) public {
    vm.expectRevert(bytes('Ownable: caller is not the owner'));

    vm.prank(address(culprit));
    baseStrategy.setDebtThreshold(debtThreshold);
  }

  function testShouldSetDebtThreshold(uint256 debtThreshold) public {
    vm.expectEmit(true, true, true, true);
    baseStrategy.emitDebtThresholdUpdated(debtThreshold);

    baseStrategy.setDebtThreshold(debtThreshold);

    assertEq(baseStrategy.debtThreshold(), debtThreshold);
  }

  function testRevertOnSetEstimatedWorkGasIfCallerIsNotAnOwner(uint256 estimatedWorkGas) public {
    vm.expectRevert(bytes('Ownable: caller is not the owner'));

    vm.prank(address(culprit));
    baseStrategy.setEstimatedWorkGas(estimatedWorkGas);
  }

  function testShouldSetEstimatedWorkGas(uint256 estimatedWorkGas) public {
    vm.expectEmit(true, true, true, true);
    baseStrategy.emitEstimatedWorkGasUpdated(estimatedWorkGas);

    baseStrategy.setEstimatedWorkGas(estimatedWorkGas);

    assertEq(baseStrategy.estimatedWorkGas(), estimatedWorkGas);
  }

  function testRevertOnSetNativeTokenPriceFeedIfCallerIsNotAnOwner(AggregatorV3Interface priceFeed) public {
    vm.expectRevert(bytes('Ownable: caller is not the owner'));

    vm.prank(address(culprit));
    baseStrategy.setNativeTokenPriceFeed(priceFeed);
  }
  
  function testRevertOnSetAssetPriceFeedFeedIfCallerIsNotAnOwner(AggregatorV3Interface priceFeed) public {
    vm.expectRevert(bytes('Ownable: caller is not the owner'));

    vm.prank(address(culprit));
    baseStrategy.setAssetPriceFeed(priceFeed);
  }

  function testShouldSetNativeTokenPriceFeed(AggregatorV3Interface priceFeed) public {
    vm.expectEmit(true, true, true, true);
    baseStrategy.emitNativeTokenPriceFeedUpdated(priceFeed);

    baseStrategy.setNativeTokenPriceFeed(priceFeed);

    assertEq(address(baseStrategy.get_nativeTokenPriceFeed()), address(priceFeed));
  }
  
  function testShouldSetAssetPriceFeedFeed(AggregatorV3Interface priceFeed) public {
    vm.expectEmit(true, true, true, true);
    baseStrategy.emitAssetPriceFeedUpdated(priceFeed);

    baseStrategy.setAssetPriceFeed(priceFeed);

    assertEq(address(baseStrategy.get_assetPriceFeed()), address(priceFeed));
  }

  function testRevertOnSetProfitFactorIfCallerIsNotAnOwner(uint256 profitFactor) public {
    vm.expectRevert(bytes('Ownable: caller is not the owner'));

    vm.prank(address(culprit));
    baseStrategy.setProfitFactor(profitFactor);
  }

  function testShouldSetProfitFactor(uint256 profitFactor) public {
    vm.expectEmit(true, true, true, true);
    baseStrategy.emitUpdatedProfitFactor(profitFactor);

    baseStrategy.setProfitFactor(profitFactor);

    assertEq(baseStrategy.profitFactor(), profitFactor);
  }

  function testShouldRealiseLossIfFreedLowerThanDebt(uint256 outstandingDebt, uint256 freed) public {
    vm.assume(freed < outstandingDebt);

    underlying.mint(address(baseStrategy), freed);
    baseStrategy.setLiquidateAllPositionsReturn(freed);

    (uint256 profit, uint256 loss, uint256 debtPayment) = baseStrategy.harvestAfterShutdown(outstandingDebt);

    assertEq(loss, outstandingDebt - freed);
    assertEq(profit, 0);
    assertEq(debtPayment, outstandingDebt - loss);
  }

  function testShouldGainProfitIfFreedGreaterOrEqualToDebt(uint256 outstandingDebt, uint256 freed) public {
    vm.assume(freed >= outstandingDebt);

    underlying.mint(address(baseStrategy), freed);
    baseStrategy.setLiquidateAllPositionsReturn(freed);

    (uint256 profit, uint256 loss, uint256 debtPayment) = baseStrategy.harvestAfterShutdown(outstandingDebt);

    assertEq(loss, 0);
    assertEq(profit, freed - outstandingDebt);
    assertEq(debtPayment, outstandingDebt);
  }

  function testSetMinimumTimeBetweenExecutions(uint256 time) public {
    vm.assume(time > 1000);

    assertEq(baseStrategy.minimumBetweenExecutions(), minReportInterval);

    baseStrategy.setMinimumBetweenExecutions(time);

    assertEq(baseStrategy.minimumBetweenExecutions(), time);
  }

  function testFailtSetMinimumTimeBetweenExecutions(uint256 time) public {
    vm.assume(time <= 1000);

    assertEq(baseStrategy.minimumBetweenExecutions(), minReportInterval);

    vm.expectRevert(TimeMinimumBetweenExecutionsIncorrect.selector);
    baseStrategy.setMinimumBetweenExecutions(time);

    assertEq(baseStrategy.minimumBetweenExecutions(), time);
  }

  function testShouldFailWithPermissionSetMinimumTimeBetweenExecutions(uint256 time) public {
    vm.assume(time > 1000);

    assertEq(baseStrategy.minimumBetweenExecutions(), minReportInterval);
    assertEq(baseStrategy.owner(), address(this));

    vm.expectRevert(bytes('Ownable: caller is not the owner'));
    vm.prank(address(culprit));
    baseStrategy.setMinimumBetweenExecutions(time);

    assertEq(baseStrategy.minimumBetweenExecutions(), minReportInterval);
  }

  function testHealthCheckPass(uint256 amount) public {
    vm.assume(amount > 100 && amount < 10 ** 22);
    // Give the required funds to Actor
    underlying.mint(alice, amount);
    assertEq(underlying.balanceOf(alice), amount);

    // Allow to vault to take the Actor's assets
    vm.prank(alice);
    underlying.increaseAllowance(address(vault), type(uint256).max);

    // Actor deposits funds to the vault
    vm.prank(alice);
    vault.deposit(amount);

    vm.mockCall(address(vault), abi.encodeWithSelector(vault.reportNegativeDebtManagement.selector), abi.encode());
    vm.expectEmit(true, true, true, true);
    // should allow strategy to collect profit
    baseStrategy.emitHealthCheckTriggered(0);

    baseStrategy.callWork();
  }

  function testHealthCheckTriggerAcceptableLossFallback(uint256 amount) public {
    vm.assume(amount > 100 && amount < 10 ** 22);

    // Give the required funds to Actor
    underlying.mint(alice, amount);
    assertEq(underlying.balanceOf(alice), amount);

    // Allow to vault to take the Actor's assets
    vm.prank(alice);
    underlying.increaseAllowance(address(vault), type(uint256).max);

    // Actor deposits funds to the vault
    vm.prank(alice);
    vault.deposit(amount);

    // distribute funds to strategy
    baseStrategy.setHarvestLoss(0);
    baseStrategy.callWork();

    baseStrategy.setHarvestProfit(0);
    // loss should be less then debt ratio threshold(15%)
    baseStrategy.setHarvestLoss(amount / 100);

    vm.mockCall(address(vault), abi.encodeWithSelector(vault.reportNegativeDebtManagement.selector), abi.encode());

    vm.expectEmit(true, true, true, true);
    // report loss but not stop strategy
    baseStrategy.emitHealthCheckTriggered(1);

    baseStrategy.callWork();
  }

  function testHealthCheckTriggerFailedAndToBeShutdown(uint256 amount) public {
    vm.assume(amount > 100 && amount < 10 ** 22);

    // Give the required funds to Actor
    underlying.mint(alice, amount);
    assertEq(underlying.balanceOf(alice), amount);
    assertEq(baseStrategy.freeAssets(), 0);

    // Allow to vault to take the Actor's assets
    vm.prank(alice);
    underlying.increaseAllowance(address(vault), type(uint256).max);

    // Actor deposits funds to the vault
    vm.prank(alice);
    vault.deposit(amount);

    // distribute funds to strategy
    assertEq(baseStrategy.freeAssets(), 0);
    baseStrategy.setHarvestLoss(0);
    baseStrategy.callWork();

    // expected behavior to have a full amount due to abstract logic in BaseStrategy
    assertEq(baseStrategy.freeAssets(), amount);

    baseStrategy.setHarvestProfit(0);
    // loss should be greater then debt ratio threshold(15%)
    baseStrategy.setHarvestLoss(amount * 2);

    vm.mockCall(address(vault), abi.encodeWithSelector(vault.reportNegativeDebtManagement.selector), abi.encode());

    vm.expectEmit(true, true, true, true);
    // report loss but not stop strategy
    baseStrategy.emitHealthCheckTriggered(2);
    vm.expectEmit(true, true, true, true);
    vault.emitStrategyRevokedEvent(address(baseStrategy));

    baseStrategy.callWork();
  }

  function testSetOpsShouldRequireOwnerRights() public {
    vm.expectRevert(bytes('Ownable: caller is not the owner'));

    vm.prank(address(culprit));
    baseStrategy.setGelatoOps(IOps(address(0)));
  }

  function testSetOpsShouldChangeOpsAddress() public {
    assertEq(address(baseStrategy.ops()), address(ops));
    baseStrategy.setGelatoOps(IOps(address(1)));
    assertEq(address(baseStrategy.ops()), address(1));
  }
}
