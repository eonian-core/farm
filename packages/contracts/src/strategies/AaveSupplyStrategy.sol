// SPDX-License-Identifier: GNU AGPLv3
pragma solidity ^0.8.26;

import {MathUpgradeable} from '@openzeppelin/contracts-upgradeable/utils/math/MathUpgradeable.sol';
import {AggregatorV3Interface} from '@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol';
import {IERC20Upgradeable} from '@openzeppelin/contracts-upgradeable/token/ERC20/IERC20Upgradeable.sol';
import {IERC20MetadataUpgradeable} from '@openzeppelin/contracts-upgradeable/token/ERC20/extensions/IERC20MetadataUpgradeable.sol';

import {BaseStrategy, IOps} from './BaseStrategy.sol';
import {IStrategy} from './IStrategy.sol';
import {IStrategiesLender} from '../lending/IStrategiesLender.sol';
import {SafeInitializable} from '../upgradeable/SafeInitializable.sol';
import {SafeUUPSUpgradeable} from '../upgradeable/SafeUUPSUpgradeable.sol';
import {IPool} from './protocols/aave/IPool.sol';
import {DataTypes} from './protocols/aave/DataTypes.sol';

error UnsupportedAssetByPool();
error IncompatibleDecimals();

contract AaveSupplyStrategy is SafeUUPSUpgradeable, BaseStrategy {
  uint256 public constant RAY = 10 ** 27;

  IPool public pool;
  IERC20Upgradeable public aToken;
  uint256 public secondsPerBlock;

  uint256[50] private __gap;

  event WithdrawnFromProtocol(uint256 amountToWithdraw, uint256 computedAmount, uint256 withdrawnAmount);
  event DepositedToProtocol(uint256 amountToDeposit, uint256 depositedAmount);

  /// @custom:oz-upgrades-unsafe-allow constructor
  constructor(bool needDisableInitializers) SafeInitializable(needDisableInitializers) {} // solhint-disable-line no-empty-blocks

  function initialize(
    IStrategiesLender _lender,
    IERC20Upgradeable _asset,
    IPool _pool,
    IOps _ops,
    uint256 _minReportInterval,
    bool _isPrepaid,
    AggregatorV3Interface _nativeTokenPriceFeed,
    AggregatorV3Interface _assetPriceFeed,
    address _healthCheck,
    uint256 _secondsPerBlock
  ) public initializer {
    __SafeUUPSUpgradeable_init_direct();
    __BaseStrategy_init(
      _lender,
      _asset,
      _ops,
      _minReportInterval,
      _isPrepaid,
      _nativeTokenPriceFeed,
      _assetPriceFeed,
      _healthCheck
    ); // Ownable is under the hood
    __AaveSupplyStrategy_init_unchained(_pool, _secondsPerBlock);
  }

  function __AaveSupplyStrategy_init_unchained(IPool _pool, uint256 _secondsPerBlock) internal onlyInitializing {
    pool = _pool;
    secondsPerBlock = _secondsPerBlock;

    address aTokenAddress = _getReserveData().aTokenAddress;
    if (aTokenAddress == address(0)) {
      revert UnsupportedAssetByPool();
    }
    aToken = IERC20Upgradeable(aTokenAddress);

    // In each case, the decimal numbers of aToken must be equal to the decimal numbers of the asset
    if (IERC20MetadataUpgradeable(aTokenAddress).decimals() != IERC20MetadataUpgradeable(address(asset)).decimals()) {
      revert IncompatibleDecimals();
    }

    // Give full asset allowance to the pool
    approveTokenMax(address(asset), address(pool));
  }

  /// @notice Estimates the total amount of strategy funds (including those invested in the base protocol).
  function estimatedTotalAssets() public view override returns (uint256) {
    return _freeAssets() + aToken.balanceOf(address(this));
  }

  /// @notice The main function of the strategy.
  /// By calling this function, the strategy must realize (take out) the possible profits from the underlying protocol.
  function _harvest(
    uint256 outstandingDebt
  ) internal override returns (uint256 profit, uint256 loss, uint256 debtPayment) {
    profit = 0;
    loss = 0;

    // No positions to harvest, allocate available funds to pay the debt (if any)
    if (aToken.balanceOf(address(this)) == 0) {
      debtPayment = MathUpgradeable.min(_freeAssets(), outstandingDebt);
      return (profit, loss, debtPayment);
    }

    uint256 deposits = aToken.balanceOf(address(this));
    uint256 assetBalance = _freeAssets();
    uint256 balance = deposits + assetBalance;

    uint256 debt = lender.currentDebt();

    if (balance <= debt) {
      loss = debt - balance;
      debtPayment = MathUpgradeable.min(assetBalance, outstandingDebt);
      return (profit, loss, debtPayment);
    }

    profit = balance - debt;
    if (assetBalance < profit) {
      _withdrawFromProtocol(profit - assetBalance);
      assetBalance = _freeAssets();
      debtPayment = MathUpgradeable.min(assetBalance, outstandingDebt);
      profit = assetBalance - debtPayment;
      return (profit, loss, debtPayment);
    }

    if (assetBalance > profit + outstandingDebt) {
      debtPayment = outstandingDebt;
      return (profit, loss, debtPayment);
    }

    debtPayment = assetBalance - profit;
    return (profit, loss, debtPayment);
  }

  /// @notice Takes the assets out of the protocol.
  /// @param amount Amount to withdraw
  /// @return The amount that has been withdrawn.
  function _withdrawFromProtocol(uint256 amount) internal returns (uint256) {
    uint256 balanceBefore = _freeAssets();

    uint256 deposits = aToken.balanceOf(address(this));
    uint256 availableAmount = MathUpgradeable.min(deposits, amount);
    pool.withdraw(address(asset), availableAmount, address(this));

    uint256 withdrawnAmount = _freeAssets() - balanceBefore;

    emit WithdrawnFromProtocol(amount, availableAmount, withdrawnAmount);

    return withdrawnAmount;
  }

  /// @notice Performs the deposit of the free funds to the underlying protocol.
  function _adjustPosition(uint256 outstandingDebt) internal override {
    if (paused()) {
      return;
    }

    uint256 assetBalance = _freeAssets();
    if (assetBalance < outstandingDebt) {
      if (aToken.balanceOf(address(this)) > 0) {
        _liquidatePosition(outstandingDebt);
      }
      return;
    }

    uint256 freeBalance = assetBalance - outstandingDebt;
    if (freeBalance > 0) {
      pool.deposit(address(asset), freeBalance, address(this), 0);
      uint256 depositedAmount = assetBalance - _freeAssets();
      emit DepositedToProtocol(freeBalance, depositedAmount);
    }
  }

  /// Tries to take a certain amount of assets out of the underlying protocol.
  /// If such an amount is not available, withdraws as much as possible.
  /// This function doesn't withdraw anything if the contract already has that amount in the balance.
  /// @param amountToLiquidate The amount of token to withdraw.
  /// @return liquidatedAmount Withdrawn amount
  /// @return loss The amount that could not be withdrawn
  function _liquidatePosition(
    uint256 amountToLiquidate
  ) internal virtual override returns (uint256 liquidatedAmount, uint256 loss) {
    uint256 assetBalance = _freeAssets();
    if (assetBalance < amountToLiquidate) {
      liquidatedAmount = assetBalance + _withdrawFromProtocol(amountToLiquidate - assetBalance);
      loss = amountToLiquidate - liquidatedAmount;
    } else {
      liquidatedAmount = amountToLiquidate;
    }
  }

  /// @notice Withdraws the entire invested amount from the underlying protocol.
  function _liquidateAllPositions() internal override returns (uint256 amountFreed) {
    amountFreed = _withdrawFromProtocol(type(uint256).max);
  }

  /// @inheritdoc IStrategy
  function interestRatePerBlock() public view returns (uint256) {
    return (_getReserveData().currentLiquidityRate / RAY) * secondsPerBlock;
  }

  /// @inheritdoc IStrategy
  function name() external view returns (string memory) {
    return string.concat(IERC20MetadataUpgradeable(address(asset)).symbol(), ' Aave Supply Strategy');
  }

  function version() external pure override returns (string memory) {
    return '0.0.1';
  }

  function setSecondsPerBlock(uint256 _secondsPerBlock) public onlyOwner {
    secondsPerBlock = _secondsPerBlock;
  }

  function _getReserveData() private view returns (DataTypes.ReserveData memory) {
    return pool.getReserveData(address(asset));
  }
}
