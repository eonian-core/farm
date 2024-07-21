// SPDX-License-Identifier: GNU AGPLv3
pragma solidity ^0.8.26;

import {MathUpgradeable} from "@openzeppelin/contracts-upgradeable/utils/math/MathUpgradeable.sol";
import {IERC20Upgradeable} from "@openzeppelin/contracts-upgradeable/token/ERC20/IERC20Upgradeable.sol";
import {AggregatorV3Interface} from "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

import {ICInterestRate} from "./protocols/ICInterestRate.sol";
import {BaseStrategy, IOps} from "./BaseStrategy.sol";
import {ICToken} from "./protocols/ICToken.sol";
import {IRainMaker} from "./protocols/IRainMaker.sol";
import {IStrategy} from "./IStrategy.sol";
import {IStrategiesLender} from "../lending/IStrategiesLender.sol";

error IncompatibleCTokenContract();
error UnsupportedDecimals();
error MintError(uint256 code);
error RedeemError(uint256 code, uint256 triedToRedeem);

/** Base for implementation of strategy on top of CToken (Compound-like market)  */
abstract contract CTokenBaseStrategy is ICInterestRate, BaseStrategy {

    /** Market on top of which strategy operates */
    ICToken public cToken;
    /** Contract which allow claim compToken reward */
    IRainMaker public rainMaker;
    /** Token which is used for reward, COMP for Compund */
    IERC20Upgradeable public compToken;

    /** Required for mapping of interest rate calculated per second to rate calculated per block */
    uint256 public secondPerBlock;

    /**
     * @dev This empty reserved space is put in place to allow future versions to add new
     * variables without shifting down storage in the inheritance chain.
     * See https://docs.openzeppelin.com/contracts/4.x/upgradeable#storage_gaps
     */
    uint256[50] private __gap;

    /** Emitted when assets are moved to the protocol */
    event DepositedToProtocol(uint256 amount, uint256 sharesBefore, uint256 underlyingBefore, uint256 sharesAfter, uint256 underlyingAfter);

    /** Emitted when assets are moved from the protocol */
    event WithdrawnFromProtocol(uint256 amount, uint256 sharesBefore, uint256 underlyingBefore, uint256 sharesAfter, uint256 underlyingAfter, uint256 redeemedAmount);

    // ------------------------------------------ Constructors ------------------------------------------

    function __CTokenBaseStrategy_init(
        IStrategiesLender _lender,
        IERC20Upgradeable _asset,
        ICToken _cToken,
        IRainMaker _rainMaker,
        IERC20Upgradeable _compToken,
        IOps _ops,
        AggregatorV3Interface _nativeTokenPriceFeed,
        AggregatorV3Interface _assetPriceFeed,
        uint256 _minReportInterval,
        bool _isPrepaid,
        address _healthCheck
    ) public onlyInitializing {
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

        __CTokenBaseStrategyinit_unchained(_cToken, _rainMaker, _compToken);
    }

    function __CTokenBaseStrategyinit_unchained(ICToken _cToken, IRainMaker _rainMaker, IERC20Upgradeable _compToken) internal onlyInitializing {
        secondPerBlock = 3; // 3.01 seconds avarage for BSC
        cToken = _cToken;
        rainMaker = _rainMaker;
        compToken = _compToken;

        if (cToken.decimals() != 8 || _assetDecimals != 18) {
            revert UnsupportedDecimals();
        }

        if (cToken.underlying() != address(asset)) {
            revert IncompatibleCTokenContract();
        }

        approveTokenMax(address(asset), address(_cToken));
    }

    /// @notice Returns the current banana balance of the strategy contract.
    function _currentBananaBalance() internal view returns (uint256) {
        return compToken.balanceOf(address(this));
    }

    /// @notice Retrieves accrued BANANA from the protocol.
    function _claimBanana() internal {
        ICToken[] memory tokens = new ICToken[](1);
        tokens[0] = cToken;
        rainMaker.claimComp(address(this), tokens);
    }

    /// @inheritdoc IStrategy
    function interestRatePerBlock() public view returns (uint256) {
        return supplyRatePerBlock();
    }

    /// @notice Returns current deposited balance (in asset).
    /// @dev Unlike the snapshot function, this function recalculates the value of the deposit.
    function depositedBalance() public returns (uint256) {
        return cToken.balanceOfUnderlying(address(this));
    }

    /// @notice Returns current deposited balance (in shares, in asset).
    /// @dev The exchange rate is recalculated at the last time someone touched the cToken contract.
    ///      Transactions are not performed too often on this contract, perhaps we should consider recalculating the rate ourselves.
    function depositedBalanceSnapshot() public view returns (uint256, uint256) {
        (, uint256 cTokenBalance, , uint256 exchangeRate) = cToken.getAccountSnapshot(address(this));

        // ApeSwap's cToken has 8 decimals and the exchange rate has 28 decimals (see why: https://docs.compound.finance/v2/ctokens/#exchange-rate).
        // To convert cTokens to assets, we need to scale down the multiplication of these numbers by 1e18 to get underlying decimals (which are 18).
        return (cTokenBalance, (cTokenBalance * exchangeRate) / 1e18);
    }

    /// @notice Deposits the assets into the protocol.
    /// @param amount Amount to deposit
    function depositToProtocol(uint256 amount) internal {
        (uint256 sharesBefore, uint256 underlyingBefore) = depositedBalanceSnapshot();

        uint256 result = cToken.mint(amount);
        if (result > 0) {
            revert MintError(result);
        }

        (uint256 sharesAfter, uint256 underlyingAfter) = depositedBalanceSnapshot();
        emit DepositedToProtocol(amount, sharesBefore, underlyingBefore, sharesAfter, underlyingAfter);
    }

    /// @notice Takes the assets out of the protocol.
    /// @param amount Amount to withdraw
    /// @return The amount that has been withdrawn.
    function withdrawFromProtocol(uint256 amount) internal returns (uint256) {
        (uint256 sharesBefore,) = depositedBalanceSnapshot();

        uint256 balanceBefore = _freeAssets();
        uint256 deposits = depositedBalance();
        uint256 amountToRedeem = MathUpgradeable.min(deposits, amount);
        uint256 result = cToken.redeemUnderlying(amountToRedeem);
        if (result > 0) {
            revert RedeemError(result, amountToRedeem);
        }

        (uint256 sharesAfter, uint256 underlyingAfter) = depositedBalanceSnapshot();

        // underlying protocol can return less than calculated above, so this check is required to avoid manipulations
        uint256 balanceAfter = _freeAssets();
        uint256 redeemedAmount = balanceAfter - balanceBefore;

        emit WithdrawnFromProtocol(amountToRedeem, sharesBefore, deposits, sharesAfter, underlyingAfter, redeemedAmount);

        return redeemedAmount;
    }


    // ------------------------------------------ Pass interest-related methods from cToken ------------------------------------------
    // Methods must be overridden by the strategy contract if they change the interest rate model

    /// @inheritdoc ICInterestRate
    function borrowRatePerBlock() public view returns (uint256) {
        if (cToken.blocksBased()) {
            return cToken.borrowRatePerBlock();
        }

        // in this case "PerBlock" actually means "PerSecond"
        return cToken.borrowRatePerBlock() * secondPerBlock;
    }

    /// @inheritdoc ICInterestRate
    function supplyRatePerBlock() public view returns (uint256) {
        if (cToken.blocksBased()) {
            return cToken.supplyRatePerBlock();
        }

        // in this case "PerBlock" actually means "PerSecond"
        return cToken.supplyRatePerBlock() * secondPerBlock;
    }

    /// @inheritdoc ICInterestRate
    function exchangeRateCurrent() public returns (uint256) {
        return cToken.exchangeRateCurrent();
    }

    /// @inheritdoc ICInterestRate
    function exchangeRateStored() public view returns (uint256) {
        return cToken.exchangeRateStored();
    }

    /// @inheritdoc ICInterestRate
    function accrueInterest() public returns (uint256) {
        return cToken.accrueInterest();
    }
}