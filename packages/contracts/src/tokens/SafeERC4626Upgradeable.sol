// SPDX-License-Identifier: GNU AGPLv3
pragma solidity ^0.8.26;

import {IERC20Upgradeable} from "@openzeppelin/contracts-upgradeable/token/ERC20/IERC20Upgradeable.sol";
import {SafeERC20Upgradeable} from "@openzeppelin/contracts-upgradeable/token/ERC20/utils/SafeERC20Upgradeable.sol";
import {FixedPointMathLib} from "solmate/utils/FixedPointMathLib.sol";

import {ERC4626Upgradeable, GivenAssetsResultIsZeroShares, GivenSharesResultIsZeroAssets} from "./ERC4626Upgradeable.sol";

/// @title Safier and limited implementation of ERC-4626
/// @notice ERC-4626 standard allow deposit and withdraw not for message sender.
///  It commonly known issue, which hardly to test and much error prune.
///  Such interfaces caused vulnerabilities, which resulted in million dollars hacks.
///  On anther hand, this interfaces not have any use cases which cannot be implemented without `transferFrom` method.
///  This implementation prevent spends and allowances from any methods except transferFrom/send
///  Also main business logic simplified to reduce gas consumption.
abstract contract SafeERC4626Upgradeable is ERC4626Upgradeable {
    using SafeERC20Upgradeable for IERC20Upgradeable;
    using FixedPointMathLib for uint256;

    /**
     * @dev This empty reserved space is put in place to allow future versions to add new
     * variables without shifting down storage in the inheritance chain.
     * See https://docs.openzeppelin.com/contracts/4.x/upgradeable#storage_gaps
     */
    uint256[50] private __gap;

    // ------------------------------------------ Constructors ------------------------------------------

    /**
     * Constructor for the SafeERC4626Upgradeable contract
     * @param _asset which will be stored in this Vault
     * @dev `defaultOperators` may be an empty array.
     */
    function __SafeERC4626_init(
        IERC20Upgradeable _asset,
        string memory name_,
        string memory symbol_,
        address[] memory defaultOperators_
    ) internal onlyInitializing {
        __ERC4626_init(_asset, name_, symbol_, defaultOperators_);
    }

    /**
     * Unchained constructor for the SafeERC4626Upgradeable contract, without parents contracts init
     * @param _asset which will be stored in this Vault
     */
    function __SafeERC4626Upgradeable_init_unchained(IERC20Upgradeable _asset)
        internal
        onlyInitializing
    {
        __ERC4626_init_unchained(_asset);
    }

    /// @notice Mints the Vault shares for msg.sender, according to the number of deposited base tokens.
    /// - emits the Deposit event.
    /// - support ERC-20 approve / transferFrom on asset as a deposit flow.
    ///   MAY support an additional flow in which the underlying tokens are owned by the Vault contract
    ///   before the deposit execution, and are accounted for during deposit.
    /// - revert if all of assets cannot be deposited (due to deposit limit being reached, slippage, the user not approving enough underlying tokens to the Vault contract, etc).
    /// Note that most implementations will require pre-approval of the Vault with the Vault’s underlying asset token.
    function deposit(uint256 assets)
        public
        virtual
        nonReentrant
        returns (uint256 shares)
    {
        shares = previewDeposit(assets);
        // Check for rounding error since we round down in previewDeposit.
        if(shares == 0) {
            revert GivenAssetsResultIsZeroShares();
        }

        _receiveAndDeposit(assets, shares, msg.sender);
    }

    /// @notice Mints exactly requested Vault shares to msg.sender by depositing any required amount of underlying tokens.
    /// - emits the Deposit event.
    /// - support ERC-20 approve / transferFrom on asset as a deposit flow.
    ///   MAY support an additional flow in which the underlying tokens are owned by the Vault contract
    ///   before the deposit execution, and are accounted for during deposit.
    /// - revert if all of assets cannot be deposited (due to deposit limit being reached, slippage, the user not approving enough underlying tokens to the Vault contract, etc).
    /// Note that most implementations will require pre-approval of the Vault with the Vault’s underlying asset token.
    function mint(uint256 shares)
        public
        virtual
        nonReentrant
        returns (uint256 assets)
    {
        // No need to check for rounding error, previewMint rounds up.
        assets = previewMint(shares);

        _receiveAndDeposit(assets, shares, msg.sender);
    }

    /// @notice Burns shares from msg.sender and sends exactly assets of underlying tokens to msg.sender.
    /// - emit the Withdraw event.
    /// - support a withdraw flow where the shares are burned from owner directly where owner is msg.sender.
    /// - MAY support an additional flow in which the shares are transferred to the Vault contract
    ///   before the withdraw execution, and are accounted for during withdraw.
    /// - revert if all of assets cannot be withdrawn (due to withdrawal limit being reached,
    ///   slippage, the owner not having enough shares, etc).
    /// Note that some implementations will require pre-requesting to the Vault
    /// before a withdrawal may be performed. Those methods should be performed separately.
    function withdraw(uint256 assets)
        public
        virtual
        nonReentrant
        returns (uint256 shares)
    {
        // No need to check for rounding error, previewWithdraw rounds up.
        shares = previewWithdraw(assets);

        _withdrawAndSend(assets, shares, msg.sender, msg.sender);
    }

    /// @notice Burns exactly shares from msg.sender and sends assets of underlying tokens to msg.sender.
    /// - emit the Withdraw event.
    /// - support a redeem flow where the shares are burned from owner directly where owner is msg.sender.
    /// - MAY support an additional flow in which the shares are transferred to the Vault contract
    ///   before the redeem execution, and are accounted for during redeem.
    /// - revert if all of shares cannot be redeemed (due to withdrawal limit being reached,
    ///   slippage, the owner not having enough shares, etc).
    /// Note that some implementations will require pre-requesting to the Vault
    /// before a withdrawal may be performed. Those methods should be performed separately.
    function redeem(uint256 shares)
        public
        virtual
        nonReentrant
        returns (uint256 assets)
    {
        assets = previewRedeem(shares);
        // Check for rounding error since we round down in previewRedeem.
        if(assets == 0) {
            revert GivenSharesResultIsZeroAssets();
        }

        _withdrawAndSend(assets, shares, msg.sender, msg.sender);
    }

    /* //////////////////// Backwards compatible methods ////////////////////////// */

    /// @inheritdoc ERC4626Upgradeable
    function deposit(
        uint256 assets,
        address /* receiver */
    ) public virtual override returns (uint256 shares) {
        // nonReentrant under the hood
        return deposit(assets);
    }

    /// @inheritdoc ERC4626Upgradeable
    function mint(
        uint256 shares,
        address /* receiver */
    ) public virtual override returns (uint256 assets) {
        // nonReentrant under the hood
        return mint(shares);
    }

    /// @inheritdoc ERC4626Upgradeable
    function withdraw(
        uint256 assets,
        address, /* receiver */
        address /* owner */
    ) public virtual override returns (uint256 shares) {
        // nonReentrant under the hood
        return withdraw(assets);
    }

    /// @inheritdoc ERC4626Upgradeable
    function redeem(
        uint256 shares,
        address, /* receiver */
        address /* owner */
    ) public virtual override returns (uint256 assets) {
        // nonReentrant under the hood
        return redeem(shares);
    }
}
