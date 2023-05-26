// SPDX-License-Identifier: AGPL-3.0
pragma solidity ^0.8.19;

import {MathUpgradeable} from "@openzeppelin/contracts-upgradeable/utils/math/MathUpgradeable.sol";
import {IERC20MetadataUpgradeable} from "@openzeppelin/contracts-upgradeable/token/ERC20/extensions/IERC20MetadataUpgradeable.sol";
import {IERC20Upgradeable} from "@openzeppelin/contracts-upgradeable/token/ERC20/IERC20Upgradeable.sol";

import {BaseStrategy} from "./BaseStrategy.sol";
import {ICToken} from "./protocols/ICToken.sol";
import {IPancakeRouter} from  "./protocols/IPancakeRouter.sol";
import {IRainMaker} from "./protocols/IRainMaker.sol";
import {IStrategy} from "./IStrategy.sol";
import {IVault} from "../IVault.sol";

import {SafeInitializable} from "../upgradeable/SafeInitializable.sol";
import {SafeUUPSUpgradeable} from "../upgradeable/SafeUUPSUpgradeable.sol";

error IncompatibleCTokenContract();
error UnsupportedDecimals();
error MintError(uint256 code);
error RedeemError(uint256 code);

contract ApeLendingStrategy is SafeUUPSUpgradeable, BaseStrategy {
    uint256 private constant SECONDS_PER_BLOCK = 3;
    uint256 private constant REWARD_ESTIMATION_ACCURACY = 90;

    address public constant BANANA = 0x603c7f932ED1fc6575303D8Fb018fDCBb0f39a95;
    address public constant WBNB = 0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c;
    address public constant RAIN_MAKER = 0x5CB93C0AdE6B7F2760Ec4389833B0cCcb5e4efDa;
    address public constant PANCAKE_ROUTER = 0x10ED43C718714eb63d5aA57B78B54704E256024E;

    /// @notice Minimum BANANA token amount to sell.
    uint256 public minBananaToSell;

    ICToken public cToken;
    IPancakeRouter public pancakeRouter;
    IRainMaker public rainMaker;

    /**
     * @dev This empty reserved space is put in place to allow future versions to add new
     * variables without shifting down storage in the inheritance chain.
     * See https://docs.openzeppelin.com/contracts/4.x/upgradeable#storage_gaps
     */
    uint256[50] private __gap;

    // ------------------------------------------ Constructors ------------------------------------------

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor(bool needDisableInitializers) SafeInitializable(needDisableInitializers) {} // solhint-disable-line no-empty-blocks

    function initialize(
        address _vault,
        address _cToken,
        address _ops,
        address _nativeTokenPriceFeed,
        address _assetPriceFeed,
        uint256 _minReportInterval,
        bool _isPrepaid
    ) public initializer {
        __SafeUUPSUpgradeable_init_direct();
        __BaseStrategy_init(
            IVault(_vault),
            _ops,
            _minReportInterval,
            _isPrepaid,
            _nativeTokenPriceFeed,
            _assetPriceFeed,
            address(0)
        ); // ownable under the hood

        __ApeLendingStrategy_init_unchained(_cToken);
    }

    function __ApeLendingStrategy_init_unchained(address _cToken) internal onlyInitializing {
        cToken = ICToken(_cToken);
        pancakeRouter = IPancakeRouter(PANCAKE_ROUTER);
        rainMaker = IRainMaker(RAIN_MAKER);

        if (cToken.decimals() != 8 || _assetDecimals != 18) {
            revert UnsupportedDecimals();
        }

        if (cToken.underlying() != address(asset)) {
            revert IncompatibleCTokenContract();
        }

        minBananaToSell = 0.1 ether;

        approveTokenMax(BANANA, PANCAKE_ROUTER);
        approveTokenMax(address(asset), _cToken);
    }

    /// @notice Sets the minimum number of BANANA tokens that must be on the contract to sell.
    function setMinBananaToSell(uint256 _minBananaToSell) external onlyOwner {
        minBananaToSell = _minBananaToSell;
    }

    /// @inheritdoc IStrategy
    function name() external view returns (string memory) {
        return
            string.concat(
                IERC20MetadataUpgradeable(address(asset)).symbol(),
                " ApeLending Strategy"
            );
    }

    /// @inheritdoc BaseStrategy
    function estimatedTotalAssets() public view override returns (uint256) {
        return
            asset.balanceOf(address(this)) +
            depositedBalanceSnapshot() +
            _totalBananaBalanceInAsset();
    }

    /// @notice Returns current deposited balance (in asset).
    /// @dev The exchange rate is recalculated at the last time someone touched the cToken contract.
    ///      Transactions are not performed too often on this contract, perhaps we should consider recalculating the rate ourselves.
    function depositedBalanceSnapshot() public view returns (uint256) {
        (, uint256 cTokenBalance, , uint256 exchangeRate) = cToken
            .getAccountSnapshot(address(this));

        // Since every ApeSwap's cToken has 8 decimals, we can leave 1e18 as constant here.
        return (cTokenBalance * exchangeRate) / 1e18;
    }

    /// @notice Returns current deposited balance (in asset).
    /// @dev Unlike the snapshot function, this function recalculates the value of the deposit.
    function depositedBalance() public returns (uint256) {
        return cToken.balanceOfUnderlying(address(this));
    }

    /// @notice This function makes a prediction on how much BANANA is accrued per block.
    /// @dev It is not completely accurate because it uses the current protocol balance to predict into the past.
    function _estimatedAccruedBananaPerBlock() internal view returns (uint256) {
        uint256 _depositedBalance = depositedBalanceSnapshot();
        if (_depositedBalance == 0) {
            return 0; // should be impossible to have 0 balance and positive comp accrued
        }
        uint256 distributionPerBlock = rainMaker.compSupplySpeeds(
            address(cToken)
        );
        uint256 totalSupply = (cToken.totalSupply() *
            cToken.exchangeRateStored()) / 1e18;
        return
            totalSupply > 0
                ? (_depositedBalance * distributionPerBlock) / totalSupply
                : 0;
    }

    /// @notice This function makes a prediction on how much BANANA is accrued.
    /// @dev It is not completely accurate because it uses the current protocol balance to predict into the past.
    function _estimatedAccruedBanana() internal view returns (uint256) {
        uint256 bananaPerBlock = _estimatedAccruedBananaPerBlock();
        if (bananaPerBlock == 0) {
            return 0;
        }
        uint256 blocksSinceLastHarvest = (block.timestamp - vault.lastReport()) / SECONDS_PER_BLOCK; // solhint-disable-line not-rely-on-time
        return blocksSinceLastHarvest * bananaPerBlock;
    }

    /// @notice Returns the current banana balance of the strategy contract.
    function _currentBananaBalance() internal view returns (uint256) {
        return IERC20Upgradeable(BANANA).balanceOf(address(this));
    }

    /// @notice Returns the current (and estimated accrued) banana balance of the strategy contract (in asset).
    /// @dev Constant REWARD_ESTIMATION_ACCURACY is used to match accuracy expectations.
    function _totalBananaBalanceInAsset() internal view returns (uint256) {
        uint256 balance = _currentBananaBalance() + _estimatedAccruedBanana();
        if (balance == 0) {
            return 0;
        }
        uint256[] memory amounts = pancakeRouter.getAmountsOut(
            balance,
            _tokenSwapPath(BANANA, address(asset))
        );
        uint256 amount = amounts[amounts.length - 1];
        return (amount * REWARD_ESTIMATION_ACCURACY) / 100;
    }

    /// @notice Prepares a chain of tokens (pair or triplet) to pass it into the router contract.
    function _tokenSwapPath(address tokenIn, address tokenOut)
        internal
        pure
        returns (address[] memory path)
    {
        bool isWBNB = tokenIn == address(WBNB) || tokenOut == address(WBNB);
        path = new address[](isWBNB ? 2 : 3);
        path[0] = tokenIn;

        if (isWBNB) {
            path[1] = tokenOut;
        } else {
            path[1] = address(WBNB);
            path[2] = tokenOut;
        }
    }

    /// @notice Retrieves accrued BANANA from the protocol.
    function _claimBanana() internal {
        ICToken[] memory tokens = new ICToken[](1);
        tokens[0] = cToken;
        rainMaker.claimComp(address(this), tokens);
    }

    /// @notice Changes the existing BANANA on the contract to an asset token.
    function _swapBananaToAsset() internal {
        uint256 bananaBalance = IERC20Upgradeable(BANANA).balanceOf(
            address(this)
        );
        if (bananaBalance < minBananaToSell) {
            return;
        }

        pancakeRouter.swapExactTokensForTokens(
            bananaBalance,
            0,
            _tokenSwapPath(BANANA, address(asset)),
            address(this),
            block.timestamp // solhint-disable-line not-rely-on-time
        );
    }

    /// @inheritdoc BaseStrategy
    function _harvest(uint256 outstandingDebt)
        internal
        override
        returns (
            uint256 profit,
            uint256 loss,
            uint256 debtPayment
        )
    {
        profit = 0;
        loss = 0;

        // No positions to harvest, allocate available funds to pay the debt (if any)
        if (cToken.balanceOf(address(this)) == 0) {
            debtPayment = MathUpgradeable.min(
                asset.balanceOf(address(this)),
                outstandingDebt
            );
            return (profit, loss, debtPayment);
        }

        uint256 deposits = depositedBalance();

        _claimBanana();
        _swapBananaToAsset();

        uint256 assetBalance = asset.balanceOf(address(this));
        uint256 balance = deposits + assetBalance;

        uint256 debt = vault.currentDebt();

        if (balance > debt) {
            profit = balance - debt;
            if (assetBalance < profit) {
                debtPayment = MathUpgradeable.min(
                    assetBalance,
                    outstandingDebt
                );
                profit = assetBalance - debtPayment;
            } else if (assetBalance > profit + outstandingDebt) {
                debtPayment = outstandingDebt;
            } else {
                debtPayment = assetBalance - profit;
            }
        } else {
            loss = debt - balance;
            debtPayment = MathUpgradeable.min(assetBalance, outstandingDebt);
        }
    }

    /// @inheritdoc BaseStrategy
    function _adjustPosition(uint256 outstandingDebt) internal override {
        if (paused()) {
            return;
        }

        uint256 assetBalance = asset.balanceOf(address(this));
        if (assetBalance < outstandingDebt) {
            // We compare the balance with 1 because of rounding error
            if (cToken.balanceOf(address(this)) > 1) {
                _liquidatePosition(outstandingDebt - assetBalance);
            }
            return;
        }

        uint256 freeBalance = assetBalance - outstandingDebt;
        if (freeBalance > 0) {
            uint256 result = cToken.mint(freeBalance);
            if (result > 0) {
                revert MintError(result);
            }
        }
    }

    /// @inheritdoc BaseStrategy
    /// @dev Tagged with the keyword "virtual" for testing purposes.
    function _liquidatePosition(uint256 assets)
        internal
        virtual
        override
        returns (uint256 liquidatedAmount, uint256 loss)
    {
        uint256 assetBalance = asset.balanceOf(address(this));
        if (assetBalance < assets) {
            uint256 deposits = depositedBalance();
            uint256 amountToRedeem = MathUpgradeable.min(deposits, assets);
            uint256 result = cToken.redeemUnderlying(amountToRedeem);
            if (result > 0) {
                revert RedeemError(result);
            }
            liquidatedAmount = amountToRedeem;
            loss = assets - liquidatedAmount;
        } else {
            liquidatedAmount = assets;
        }
    }

    /// @inheritdoc BaseStrategy
    function _liquidateAllPositions()
        internal
        override
        returns (uint256 amountFreed)
    {
        uint256 amountToRedeem = depositedBalance();
        uint256 result = cToken.redeemUnderlying(amountToRedeem);
        if (result > 0) {
            revert RedeemError(result);
        }
        amountFreed = amountToRedeem;
    }
}
