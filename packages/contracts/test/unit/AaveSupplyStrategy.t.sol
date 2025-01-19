// SPDX-License-Identifier: AGPL-3.0
pragma solidity ^0.8.0;

import 'forge-std/Test.sol';

import {IERC20Upgradeable} from '@openzeppelin/contracts-upgradeable/token/ERC20/IERC20Upgradeable.sol';
import {MathUpgradeable} from '@openzeppelin/contracts-upgradeable/utils/math/MathUpgradeable.sol';

import {IStrategiesLender} from 'contracts/lending/IStrategiesLender.sol';
import {AaveSupplyStrategy} from 'contracts/strategies/AaveSupplyStrategy.sol';

import {ERC20Mock} from './mocks/ERC20Mock.sol';
import {AavePoolMock} from './mocks/AavePoolMock.sol';
import {OpsMock} from './mocks/OpsMock.sol';
import {AggregatorV3Mock} from './mocks/AggregatorV3Mock.sol';
import {AaveSupplyStrategyMock} from './mocks/AaveSupplyStrategyMock.sol';
import {VaultMock} from './mocks/VaultMock.sol';

import {TestWithERC1820Registry} from './helpers/TestWithERC1820Registry.sol';

contract AaveSupplyStrategyTest is TestWithERC1820Registry {
  AaveSupplyStrategyMock strategy;

  address vaultAddress = address(0);
  address strategyAddress = address(0);
  address culprit = vm.addr(2);

  VaultMock vault;
  ERC20Mock asset;
  ERC20Mock aToken;
  AavePoolMock pool;
  OpsMock ops;
  AggregatorV3Mock nativeTokenPriceFeed;
  AggregatorV3Mock assetPriceFeed;

  function setUp() public {
    asset = new ERC20Mock('Mock Token', 'TKN');
    aToken = new ERC20Mock('Mock aToken', 'aTKN');
    pool = new AavePoolMock(aToken);
    ops = new OpsMock();

    vault = new VaultMock(address(asset), vm.addr(750), 1000, 10 ** 18, 100);

    nativeTokenPriceFeed = new AggregatorV3Mock();
    nativeTokenPriceFeed.setDecimals(8);
    nativeTokenPriceFeed.setPrice(274 * 1e8);

    assetPriceFeed = new AggregatorV3Mock();
    assetPriceFeed.setDecimals(8);
    assetPriceFeed.setPrice(1e8);

    strategy = new AaveSupplyStrategyMock(
      vault,
      IERC20Upgradeable(address(asset)),
      pool,
      ops,
      nativeTokenPriceFeed,
      assetPriceFeed
    );
    strategyAddress = address(strategy);

    vault.addStrategy(strategyAddress, 10_000);
    vaultAddress = address(vault);
  }

  function test_should_grant_full_allowance_to_pool() public {
    assertEq(asset.allowance(strategyAddress, address(pool)), type(uint256).max);
  }

  function test_should_not_set_seconds_per_block_if_not_owner() public {
    vm.expectRevert(bytes('Ownable: caller is not the owner'));
    vm.prank(culprit);
    strategy.setMillisecondsPerBlock(10);
  }

  function test_should_set_seconds_per_block() public {
    strategy.setMillisecondsPerBlock(10);
    assertEq(strategy.millisecondsPerBlock(), 10);

    strategy.setMillisecondsPerBlock(25);
    assertEq(strategy.millisecondsPerBlock(), 25);
  }

  function test_should_allow_vault_to_withdraw_funds(uint256 amountToWithdraw) public {
    assertEq(asset.balanceOf(vaultAddress), 0);

    aToken.mint(strategyAddress, amountToWithdraw);

    vm.prank(vaultAddress);
    strategy.withdraw(amountToWithdraw);

    assertEq(asset.balanceOf(vaultAddress), amountToWithdraw);
  }

  function test_should_allow_vault_to_withdraw_funds_as_much_as_possible(
    uint256 aTokenBalance,
    uint256 freeAssets,
    uint256 amountToWithdraw
  ) public {
    vm.assume(amountToWithdraw < type(uint240).max);
    vm.assume(aTokenBalance < type(uint240).max);
    vm.assume(freeAssets < type(uint240).max);

    assertEq(asset.balanceOf(vaultAddress), 0);

    aToken.mint(strategyAddress, aTokenBalance);
    asset.mint(strategyAddress, freeAssets);

    vm.prank(vaultAddress);
    strategy.withdraw(amountToWithdraw);

    uint256 withdrawn = MathUpgradeable.min(amountToWithdraw, aTokenBalance + freeAssets);
    assertEq(asset.balanceOf(vaultAddress), withdrawn);
  }

  function test_should_liquidate_requested_amount_in_whole(uint256 aTokenBalance, uint256 amountToLiquidate) public {
    assertEq(strategy.freeAssets(), 0); // No free assets on the strategy balance

    vm.assume(aTokenBalance > amountToLiquidate);
    vm.assume(amountToLiquidate > 0);

    aToken.mint(strategyAddress, aTokenBalance);

    vm.expectEmit();
    emit AaveSupplyStrategy.WithdrawnFromProtocol(amountToLiquidate, amountToLiquidate, amountToLiquidate);

    (uint256 liquidated, uint256 loss) = strategy.liquidatePosition(amountToLiquidate);
    assertEq(liquidated, amountToLiquidate);
    assertEq(loss, 0);
  }

  function test_should_not_liquidate_if_there_are_free_assets(
    uint256 aTokenBalance,
    uint256 freeAssets,
    uint256 amountToLiquidate
  ) public {
    vm.assume(freeAssets > amountToLiquidate);

    asset.mint(strategyAddress, freeAssets);
    assertEq(strategy.freeAssets(), freeAssets);

    aToken.mint(strategyAddress, aTokenBalance); // aToken balance should not affect anything here

    vm.recordLogs();
    (uint256 liquidated, uint256 loss) = strategy.liquidatePosition(amountToLiquidate);
    assertEq(vm.getRecordedLogs().length, 0);

    assertEq(liquidated, amountToLiquidate);
    assertEq(loss, 0);
  }

  function test_should_liquidate_partially_with_possible_loss(
    uint256 aTokenBalance,
    uint256 freeAssets,
    uint256 amountToLiquidate
  ) public {
    vm.assume(freeAssets < amountToLiquidate);

    aToken.mint(strategyAddress, aTokenBalance);
    asset.mint(strategyAddress, freeAssets);
    assertEq(strategy.freeAssets(), freeAssets);

    vm.expectEmit();

    uint256 requiredToLiquidate = amountToLiquidate - freeAssets;
    uint256 availableToLiquidate = MathUpgradeable.min(aTokenBalance, requiredToLiquidate);
    emit AaveSupplyStrategy.WithdrawnFromProtocol(requiredToLiquidate, availableToLiquidate, availableToLiquidate);

    (uint256 liquidated, uint256 loss) = strategy.liquidatePosition(amountToLiquidate);
    assertEq(liquidated, availableToLiquidate + freeAssets);
    assertEq(loss, amountToLiquidate - availableToLiquidate - freeAssets);
  }

  function test_should_liquidate_everything(uint256 aTokenBalance, uint256 freeAssets) public {
    vm.assume(aTokenBalance < type(uint240).max);
    vm.assume(freeAssets < type(uint240).max);

    aToken.mint(strategyAddress, aTokenBalance);
    asset.mint(strategyAddress, freeAssets);

    uint256 requiredToLiquidate = type(uint256).max;
    uint256 availableAmount = MathUpgradeable.min(aTokenBalance, requiredToLiquidate);

    vm.expectEmit();
    emit AaveSupplyStrategy.WithdrawnFromProtocol(requiredToLiquidate, availableAmount, availableAmount);

    uint256 liquidated = strategy.liquidateAllPositions();
    assertEq(liquidated, availableAmount);
  }

  function test_should_not_adjust_position_if_paused(uint256 outstandingDebt, uint256 freeAssets) public {
    asset.mint(strategyAddress, freeAssets);

    strategy.pause();

    vm.recordLogs();
    strategy.adjustPosition(outstandingDebt);
    assertEq(vm.getRecordedLogs().length, 0); // No events emitted
  }

  function test_should_not_adjust_position_if_has_debt_and_no_funds_to_withdraw(
    uint256 outstandingDebt,
    uint256 freeAssets
  ) public {
    vm.assume(outstandingDebt > freeAssets);

    asset.mint(strategyAddress, freeAssets);
    aToken.mint(strategyAddress, 0);

    vm.recordLogs();
    strategy.adjustPosition(outstandingDebt);
    assertEq(vm.getRecordedLogs().length, 0); // No events emitted
  }

  function test_should_adjust_position_and_liquidate_to_cover_debt(
    uint256 outstandingDebt,
    uint256 aTokenBalance,
    uint256 freeAssets
  ) public {
    vm.assume(outstandingDebt < type(uint240).max);
    vm.assume(aTokenBalance < type(uint240).max);
    vm.assume(freeAssets < type(uint240).max);

    vm.assume(outstandingDebt > freeAssets);
    vm.assume(aTokenBalance > 0);

    aToken.mint(strategyAddress, aTokenBalance);
    asset.mint(strategyAddress, freeAssets);

    assertEq(strategy.freeAssets(), freeAssets);
    strategy.adjustPosition(outstandingDebt);

    // Strategy was to withdraw the full amount of the debt or the maximum amount possible
    uint256 freeAssets_after = MathUpgradeable.min(outstandingDebt, aTokenBalance + freeAssets);
    assertEq(freeAssets_after > freeAssets, true);
    assertEq(strategy.freeAssets(), freeAssets_after);
  }

  function test_should_deposit_free_assets_back_to_underlying_protocol(
    uint256 outstandingDebt,
    uint256 aTokenBalance,
    uint256 freeAssets
  ) public {
    vm.assume(outstandingDebt < type(uint240).max);
    vm.assume(aTokenBalance < type(uint240).max);
    vm.assume(freeAssets < type(uint240).max);
    vm.assume(outstandingDebt < freeAssets); // Strategy has some profit to cover the debt and reinvest

    aToken.mint(strategyAddress, aTokenBalance);
    asset.mint(strategyAddress, freeAssets);

    uint256 balanceToReinvest = freeAssets - outstandingDebt;

    vm.expectEmit();
    emit AaveSupplyStrategy.DepositedToProtocol(balanceToReinvest, balanceToReinvest);

    strategy.adjustPosition(outstandingDebt);

    assertEq(aToken.balanceOf(strategyAddress), aTokenBalance + balanceToReinvest);
  }

  function test_should_not_deposit_to_underlying_protocol_if_there_are_no_free_assets(
    uint256 outstandingDebt,
    uint256 aTokenBalance
  ) public {
    vm.assume(outstandingDebt < type(uint240).max);
    vm.assume(aTokenBalance < type(uint240).max);

    aToken.mint(strategyAddress, aTokenBalance);
    asset.mint(strategyAddress, outstandingDebt);

    assertEq(strategy.freeAssets(), outstandingDebt); // No free assets on the balance (just to cover the debt)

    vm.recordLogs();
    strategy.adjustPosition(outstandingDebt);
    assertEq(vm.getRecordedLogs().length, 0); // No events emitted

    assertEq(aToken.balanceOf(strategyAddress), aTokenBalance);
  }

  function test_should_not_harvest_if_no_deposits(uint256 outstandingDebt, uint256 freeAssets) public {
    asset.mint(strategyAddress, freeAssets);

    (uint256 profit, uint256 loss, uint256 debtPayment) = strategy.harvest(outstandingDebt);
    assertEq(profit, 0);
    assertEq(loss, 0);
    assertEq(debtPayment, MathUpgradeable.min(freeAssets, outstandingDebt));
  }

  function test_should_report_about_loss_on_harvest(
    uint256 outstandingDebt,
    uint256 aTokenBalance,
    uint256 freeAssets,
    uint256 strategyDebt
  ) public {
    vm.assume(outstandingDebt < type(uint240).max);
    vm.assume(aTokenBalance < type(uint240).max);
    vm.assume(freeAssets < type(uint240).max);
    vm.assume(strategyDebt < type(uint240).max);

    vm.assume(aTokenBalance > 0); // Strategy has some position

    uint256 total = freeAssets + aTokenBalance;
    vm.assume(total <= strategyDebt); // Total funds less than strategy's borrowed amount = loss

    aToken.mint(strategyAddress, aTokenBalance);
    asset.mint(strategyAddress, freeAssets);

    vault.increaseDebt(strategyAddress, strategyDebt);
    assertEq(vault.currentDebt(strategyAddress), strategyDebt);

    (uint256 profit, uint256 loss, uint256 debtPayment) = strategy.harvest(outstandingDebt);
    assertEq(profit, 0);
    assertEq(loss, strategyDebt - total);
    assertEq(debtPayment, MathUpgradeable.min(freeAssets, outstandingDebt));
  }

  function test_should_report_about_profit_on_harvest_and_release_it_from_underlying_protocol(
    uint256 outstandingDebt,
    uint256 aTokenBalance,
    uint256 freeAssets,
    uint256 strategyDebt
  ) public {
    vm.assume(outstandingDebt < type(uint240).max);
    vm.assume(aTokenBalance < type(uint240).max);
    vm.assume(freeAssets < type(uint240).max);
    vm.assume(strategyDebt < type(uint240).max);

    vm.assume(aTokenBalance > 0); // Strategy has some position

    uint256 total = freeAssets + aTokenBalance;
    vm.assume(total > strategyDebt); // Total funds greater than strategy's debt = profit

    uint256 profit = total - strategyDebt;
    vm.assume(freeAssets < profit); // Some profit has to be released from the underlying protocol

    aToken.mint(strategyAddress, aTokenBalance);
    asset.mint(strategyAddress, freeAssets);
    vault.increaseDebt(strategyAddress, strategyDebt);

    vm.expectEmit();

    uint256 wantToWithdraw = profit - freeAssets;
    uint256 willWithdraw = MathUpgradeable.min(aTokenBalance, wantToWithdraw);
    emit AaveSupplyStrategy.WithdrawnFromProtocol(wantToWithdraw, willWithdraw, willWithdraw);

    (uint256 reportedProfit, uint256 reportedLoss, uint256 reportedDebtPayment) = strategy.harvest(outstandingDebt);
    assertEq(reportedProfit, freeAssets + willWithdraw - reportedDebtPayment);
    assertEq(reportedLoss, 0);
    assertEq(reportedDebtPayment, MathUpgradeable.min(freeAssets + willWithdraw, outstandingDebt));
  }

  function test_should_report_about_profit_on_harvest_when_balance_is_enough_to_cover_debt(
    uint256 outstandingDebt,
    uint256 aTokenBalance,
    uint256 freeAssets,
    uint256 strategyDebt
  ) public {
    vm.assume(outstandingDebt < type(uint240).max);
    vm.assume(aTokenBalance < type(uint240).max);
    vm.assume(freeAssets < type(uint240).max);
    vm.assume(strategyDebt < type(uint240).max);

    vm.assume(aTokenBalance > 0); // Strategy has some position

    uint256 total = freeAssets + aTokenBalance;
    vm.assume(total > strategyDebt); // Total funds greater than strategy's debt = profit

    uint256 profit = total - strategyDebt;
    vm.assume(freeAssets > profit + outstandingDebt); // Has enough funds to take profit and cover debt

    aToken.mint(strategyAddress, aTokenBalance);
    asset.mint(strategyAddress, freeAssets);
    vault.increaseDebt(strategyAddress, strategyDebt);

    (uint256 reportedProfit, uint256 reportedLoss, uint256 reportedDebtPayment) = strategy.harvest(outstandingDebt);
    assertEq(reportedProfit, profit);
    assertEq(reportedLoss, 0);
    assertEq(reportedDebtPayment, outstandingDebt);
  }

  function test_should_harvest_if_has_some_profit_but_not_enough_to_cover_debt_fully(
    uint256 outstandingDebt,
    uint256 aTokenBalance,
    uint256 freeAssets,
    uint256 strategyDebt
  ) public {
    vm.assume(outstandingDebt < type(uint240).max);
    vm.assume(aTokenBalance < type(uint240).max);
    vm.assume(freeAssets < type(uint240).max);
    vm.assume(strategyDebt < type(uint240).max);

    vm.assume(aTokenBalance > 0); // Strategy has some position

    uint256 total = freeAssets + aTokenBalance;
    vm.assume(total > strategyDebt); // Total funds greater than strategy's debt = profit

    uint256 profit = total - strategyDebt;
    vm.assume(freeAssets >= profit && freeAssets <= profit + outstandingDebt); // Has enough funds to take profit and cover debt partially

    aToken.mint(strategyAddress, aTokenBalance);
    asset.mint(strategyAddress, freeAssets);
    vault.increaseDebt(strategyAddress, strategyDebt);

    (uint256 reportedProfit, uint256 reportedLoss, uint256 reportedDebtPayment) = strategy.harvest(outstandingDebt);
    assertEq(reportedProfit, profit);
    assertEq(reportedLoss, 0);
    assertEq(reportedDebtPayment, freeAssets - profit);
  }
}
