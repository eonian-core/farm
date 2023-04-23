// SPDX-License-Identifier: AGPL-3.0-or-later
pragma solidity ^0.8.19;

import {IERC20Upgradeable} from "@openzeppelin/contracts-upgradeable/token/ERC20/IERC20Upgradeable.sol";
import {SafeERC20Upgradeable} from "@openzeppelin/contracts-upgradeable/token/ERC20/utils/SafeERC20Upgradeable.sol";
import {ERC777Upgradeable} from "@openzeppelin/contracts-upgradeable/token/ERC777/ERC777Upgradeable.sol";
import {ReentrancyGuardUpgradeable} from "@openzeppelin/contracts-upgradeable/security/ReentrancyGuardUpgradeable.sol";
import {FixedPointMathLib} from "solmate/utils/FixedPointMathLib.sol";
import {IERC4626} from "./IERC4626.sol";

/// @title ERC4626 upgradable tokenized Vault implementation based on ERC-777.
/// More info in [EIP](https://eips.ethereum.org/EIPS/eip-4626)
/// Based on Solmate (https://github.com/Rari-Capital/solmate/blob/main/src/mixins/ERC4626.sol)
///
/// ERC-777 and ERC-20 tokens represent "shares"
/// Vault “shares” which represent a claim to ownership on a fraction of the Vault’s underlying holdings.
/// -
/// @notice Rationale
///  The mint method was included for symmetry and feature completeness.
///  Most current use cases of share-based Vaults do not ascribe special meaning to the shares
///  such that a user would optimize for a specific number of shares (mint)
///  rather than specific amount of underlying (deposit).
///  However, it is easy to imagine future Vault strategies which would have unique
///  and independently useful share representations.
///  The convertTo functions serve as rough estimates that do not account for operation specific details
///  like withdrawal fees, etc. They were included for frontends and applications that need an average
///  value of shares or assets, not an exact value possibly including slippage or other fees.
///  For applications that need an exact value that attempts to account for fees and slippage we have
///  included a corresponding preview function to match each mutable function.
///  These functions must not account for deposit or withdrawal limits, to ensure they are easily composable,
///  the max functions are provided for that purpose.
abstract contract ERC4626Upgradeable is
    ERC777Upgradeable,
    ReentrancyGuardUpgradeable,
    IERC4626
{
    using SafeERC20Upgradeable for IERC20Upgradeable;
    using FixedPointMathLib for uint256;

    /**
     * @dev This empty reserved space is put in place to allow future versions to add new
     * variables without shifting down storage in the inheritance chain.
     * See https://docs.openzeppelin.com/contracts/4.x/upgradeable#storage_gaps
     */
    uint256[50] private __gap;

    /* ///////////////////////////// EVENTS ///////////////////////////// */

    /// `sender` has exchanged `assets` for `shares`, and transferred those `shares` to `owner`.
    /// emitted when tokens are deposited into the Vault via the mint and deposit methods.
    event Deposit(
        address indexed caller,
        address indexed owner,
        uint256 assets,
        uint256 shares
    );

    /// `sender` has exchanged `shares`, owned by `owner`, for `assets`, and transferred those `assets` to `receiver`.
    /// emitted when shares are withdrawn from the Vault in ERC4626.redeem or ERC4626.withdraw methods.
    event Withdraw(
        address indexed caller,
        address indexed receiver,
        address indexed owner,
        uint256 assets,
        uint256 shares
    );

    /* ///////////////////////////// CONSTRUCTORS ///////////////////////////// */

    /// @notice The underlying token managed by the Vault. Has units defined by the corresponding ERC-20 contract.
    /// Stored as address of the underlying token used for the Vault for accounting, depositing, and withdrawing.
    IERC20Upgradeable public asset;

    /**
     * Constructor for the ERC4626Upgradeable contract
     * @param _asset which will be stored in this Vault
     * @dev `defaultOperators` may be an empty array.
     */
    function __ERC4626_init(
        IERC20Upgradeable _asset,
        string memory name_,
        string memory symbol_,
        address[] memory defaultOperators_
    ) internal onlyInitializing {
        __ERC777_init(name_, symbol_, defaultOperators_);
        __ReentrancyGuard_init();

        __ERC4626_init_unchained(_asset);
    }

    /**
     * Unchained constructor for the ERC4626Upgradeable contract, without parents contracts init
     * @param _asset which will be stored in this Vault
     */
    function __ERC4626_init_unchained(IERC20Upgradeable _asset)
        internal
        onlyInitializing
    {
        asset = _asset;
    }

    /* ///////////////////////////// DEPOSIT / WITHDRAWAL ///////////////////////////// */

    /// @notice Mints Vault shares to receiver by depositing exactly amount of underlying tokens.
    /// - emits the Deposit event.
    /// - support ERC-20 approve / transferFrom on asset as a deposit flow.
    ///   MAY support an additional flow in which the underlying tokens are owned by the Vault contract
    ///   before the deposit execution, and are accounted for during deposit.
    /// - revert if all of assets cannot be deposited (due to deposit limit being reached, slippage,
    ///   the user not approving enough underlying tokens to the Vault contract, etc).
    /// Note that most implementations will require pre-approval of the Vault with the Vault’s underlying asset token.
    function deposit(uint256 assets, address receiver)
        public
        virtual
        nonReentrant
        returns (uint256 shares)
    {
        shares = previewDeposit(assets);
        // Check for rounding error since we round down in previewDeposit.
        require(shares != 0, "Given assets result in 0 shares.");

        _receiveAndDeposit(assets, shares, receiver);
    }

    /// @notice Mints exactly shares Vault shares to receiver by depositing amount of underlying tokens.
    /// - emits the Deposit event.
    /// - support ERC-20 approve / transferFrom on asset as a deposit flow.
    ///   MAY support an additional flow in which the underlying tokens are owned by the Vault contract
    ///   before the deposit execution, and are accounted for during deposit.
    /// - revert if all of assets cannot be deposited (due to deposit limit being reached, slippage, the user not approving enough underlying tokens to the Vault contract, etc).
    /// Note that most implementations will require pre-approval of the Vault with the Vault’s underlying asset token.
    function mint(uint256 shares, address receiver)
        public
        virtual
        nonReentrant
        returns (uint256 assets)
    {
        // No need to check for rounding error, previewMint rounds up.
        assets = previewMint(shares);

        _receiveAndDeposit(assets, shares, receiver);
    }

    /// @notice Base deposit logic which common for public deposit and mint function
    /// Trasfer assets from sender and mint shares for receiver
    function _receiveAndDeposit(
        uint256 assets,
        uint256 shares,
        address receiver
    ) internal {
        // cases when msg.sender != receiver are error prone
        // but they are allowed by the standard... we need take care of it ourselves

        // Need to transfer before minting or ERC777s could reenter.
        asset.safeTransferFrom(msg.sender, address(this), assets);

        _mint(receiver, shares, "", "");

        emit Deposit(msg.sender, receiver, assets, shares);

        afterDeposit(assets, shares);
    }

    /// @notice Burns shares from owner and sends exactly assets of underlying tokens to receiver.
    /// - emit the Withdraw event.
    /// - support a withdraw flow where the shares are burned from owner directly where owner is msg.sender.
    /// - support a withdraw flow where the shares are burned from owner directly where msg.sender
    ///   has ERC-20 approval over the shares of owner.
    /// - MAY support an additional flow in which the shares are transferred to the Vault contract
    ///   before the withdraw execution, and are accounted for during withdraw.
    /// - revert if all of assets cannot be withdrawn (due to withdrawal limit being reached,
    ///   slippage, the owner not having enough shares, etc).
    /// Note that some implementations will require pre-requesting to the Vault
    /// before a withdrawal may be performed. Those methods should be performed separately.
    function withdraw(
        uint256 assets,
        address receiver,
        address owner
    ) public virtual nonReentrant returns (uint256 shares) {
        // No need to check for rounding error, previewWithdraw rounds up.
        shares = previewWithdraw(assets);

        _withdrawAndSend(assets, shares, receiver, owner);
    }

    /// @notice Burns exactly shares from owner and sends assets of underlying tokens to receiver.
    /// - emit the Withdraw event.
    /// - support a redeem flow where the shares are burned from owner directly where owner is msg.sender.
    /// - support a redeem flow where the shares are burned from owner directly where msg.sender
    ///   has ERC-20 approval over the shares of owner.
    /// - MAY support an additional flow in which the shares are transferred to the Vault contract
    ///   before the redeem execution, and are accounted for during redeem.
    /// - revert if all of shares cannot be redeemed (due to withdrawal limit being reached,
    ///   slippage, the owner not having enough shares, etc).
    /// Note that some implementations will require pre-requesting to the Vault
    /// before a withdrawal may be performed. Those methods should be performed separately.
    function redeem(
        uint256 shares,
        address receiver,
        address owner
    ) public virtual nonReentrant returns (uint256 assets) {
        assets = previewRedeem(shares);
        // Check for rounding error since we round down in previewRedeem.
        require(assets != 0, "Given shares result in 0 assets.");

        _withdrawAndSend(assets, shares, receiver, owner);
    }

    /// @notice Burn owner shares and send tokens to receiver.
    function _withdrawAndSend(
        uint256 assets,
        uint256 shares,
        address receiver,
        address owner
    ) internal {
        // cases when msg.sender != receiver != owner is error prune
        // but they allowed by standard... take care of it by self
        if (msg.sender != owner) {
            _spendAllowance(owner, msg.sender, shares);
        }

        beforeWithdraw(assets, shares);

        _burn(owner, shares, "", "");

        emit Withdraw(msg.sender, receiver, owner, assets, shares);

        asset.safeTransfer(receiver, assets);
    }

    /* ///////////////////////////// ACCOUNTING ///////////////////////////// */

    /// @notice Allows an on-chain or off-chain user to simulate the effects of their deposit at the current block,
    /// given current on-chain conditions.
    /// - return as close to and no more than the exact amount of Vault shares that would be minted
    ///   in a deposit call in the same transaction.
    ///   I.e. deposit should return the same or more shares as previewDeposit if called in the same transaction.
    /// - NOT account for deposit limits like those returned from maxDeposit
    ///   and should always act as though the deposit would be accepted,
    ///   regardless if the user has enough tokens approved, etc.
    /// - inclusive of deposit fees. Integrators should be aware of the existence of deposit fees.
    /// - NOT revert due to vault specific user/global limits. MAY revert due to other conditions that would also cause deposit to revert.
    /// Note that any unfavorable discrepancy between convertToShares and previewDeposit
    /// SHOULD be considered slippage in share price or some other type of condition,
    /// meaning the depositor will lose assets by depositing.
    function previewDeposit(uint256 assets)
        public
        view
        virtual
        returns (uint256)
    {
        return convertToShares(assets);
    }

    /// @notice Allows an on-chain or off-chain user to simulate the effects of their mint at the current block,
    /// given current on-chain conditions.
    /// - return as close to and no fewer than the exact amount of assets that would be deposited
    ///   in a mint call in the same transaction.
    ///   I.e. mint should return the same or fewer assets as previewMint if called in the same transaction.
    /// - NOT account for mint limits like those returned from maxMint
    ///   and should always act as though the mint would be accepted,
    ///   regardless if the user has enough tokens approved, etc.
    /// - inclusive of deposit fees. Integrators should be aware of the existence of deposit fees.
    /// - NOT revert due to vault specific user/global limits.
    ///   MAY revert due to other conditions that would also cause mint to revert.
    /// Note that any unfavorable discrepancy between convertToAssets and previewMint
    /// SHOULD be considered slippage in share price or some other type of condition,
    /// meaning the depositor will lose assets by minting.
    function previewMint(uint256 shares) public view virtual returns (uint256) {
        uint256 supply = totalSupply(); // Saves an extra SLOAD if totalSupply is non-zero.
        if (supply == 0) {
            return shares;
        }

        return shares.mulDivUp(totalAssets(), supply);
    }

    /// @notice Allows an on-chain or off-chain user to simulate the effects of their withdrawal
    /// at the current block, given current on-chain conditions.
    /// - return as close to and no fewer than the exact amount of Vault shares
    ///   that would be burned in a withdraw call in the same transaction.
    ///   I.e. withdraw should return the same or fewer shares as previewWithdraw
    ///   if called in the same transaction.
    /// - NOT account for withdrawal limits like those returned from maxWithdraw
    ///   and should always act as though the withdrawal would be accepted,
    ///   regardless if the user has enough shares, etc.
    /// - inclusive of withdrawal fees. Integrators should be aware of the existence of withdrawal fees.
    /// - NOT revert due to vault specific user/global limits.
    ///   MAY revert due to other conditions that would also cause withdraw to revert.
    /// Note that any unfavorable discrepancy between convertToShares and previewWithdraw
    /// SHOULD be considered slippage in share price or some other type of condition,
    /// meaning the depositor will lose assets by depositing.
    function previewWithdraw(uint256 assets)
        public
        view
        virtual
        returns (uint256)
    {
        uint256 supply = totalSupply(); // Saves an extra SLOAD if totalSupply is non-zero.
        if (supply == 0) {
            return assets;
        }
        return assets.mulDivUp(supply, totalAssets());
    }

    /// @notice Allows an on-chain or off-chain user to simulate the effects of their
    /// redeemption at the current block, given current on-chain conditions.
    /// - return as close to and no more than the exact amount of assets that would be withdrawn
    ///   in a redeem call in the same transaction.
    ///   I.e. redeem should return the same or more assets as previewRedeem
    ///   if called in the same transaction.
    /// - NOT account for redemption limits like those returned from maxRedeem
    ///   and should always act as though the redemption would be accepted,
    ///   regardless if the user has enough shares, etc.
    /// - inclusive of withdrawal fees. Integrators should be aware of the existence of withdrawal fees.
    /// - NOT revert due to vault specific user/global limits.
    ///   MAY revert due to other conditions that would also cause redeem to revert.
    /// Note that any unfavorable discrepancy between convertToAssets and previewRedeem
    /// SHOULD be considered slippage in share price or some other type of condition,
    /// meaning the depositor will lose assets by redeeming.
    function previewRedeem(uint256 shares)
        public
        view
        virtual
        returns (uint256)
    {
        return convertToAssets(shares);
    }

    /// @notice The amount of shares that the Vault would exchange for the amount of assets provided,
    /// in an ideal scenario where all the conditions are met.
    /// - is NOT inclusive of any fees that are charged against assets in the Vault.
    /// - do NOT show any variations depending on the caller.
    /// - do NOT reflect slippage or other on-chain conditions, when performing the actual exchange.
    /// - do NOT revert unless due to integer overflow caused by an unreasonably large input.
    /// - round down towards 0.
    /// This calculation MAY NOT reflect the “per-user” price-per-share,
    /// and instead should reflect the “average-user’s” price-per-share,
    /// meaning what the average user should expect to see when exchanging to and from.
    function convertToShares(uint256 assets)
        public
        view
        virtual
        returns (uint256)
    {
        uint256 supply = totalSupply(); // Saves an extra SLOAD if totalSupply is non-zero.
        if (supply == 0) {
            return assets;
        }

        return assets.mulDivDown(supply, totalAssets());
    }

    /// @notice The amount of assets that the Vault would exchange for the amount of shares provided, in an ideal scenario where all the conditions are met.
    /// - is NOT inclusive of any fees that are charged against assets in the Vault.
    /// - do NOT show any variations depending on the caller.
    /// - do NOT reflect slippage or other on-chain conditions, when performing the actual exchange.
    /// - do NOT revert unless due to integer overflow caused by an unreasonably large input.
    /// - round down towards 0.
    /// This calculation MAY NOT reflect the “per-user” price-per-share,
    /// and instead should reflect the “average-user’s” price-per-share,
    /// meaning what the average user should expect to see when exchanging to and from.
    function convertToAssets(uint256 shares)
        public
        view
        virtual
        returns (uint256)
    {
        uint256 supply = totalSupply(); // Saves an extra SLOAD if totalSupply is non-zero.
        if (supply == 0) {
            return shares;
        }

        return shares.mulDivDown(totalAssets(), supply);
    }

    /// @notice Total amount of the underlying asset that is “managed” by Vault.
    /// - include any compounding that occurs from yield.
    /// - inclusive of any fees that are charged against assets in the Vault.
    /// - is NOT revert
    /// @dev Must be implemented by child contract.
    function totalAssets() public view virtual returns (uint256);

    /* //////////////////////////////// DEPOSIT / WITHDRAWAL LIMIT //////////////////////////////// */

    /// @notice Maximum amount of the underlying asset that can be deposited into the Vault for the receiver,
    /// through a deposit call.
    /// - returns the maximum amount of assets deposit would allow to be deposited
    ///   for receiver and not cause a revert, which MUST NOT be higher than the actual maximum
    ///   that would be accepted (it should underestimate if necessary).
    ///   This assumes that the user has infinite assets, i.e. MUST NOT rely on balanceOf of asset.
    /// - factor in both global and user-specific limits, like if deposits are entirely disabled (even temporarily) it MUST return 0.
    /// - return 2 ** 256 - 1 if there is no limit on the maximum amount of assets that may be deposited.
    function maxDeposit(address) public view virtual returns (uint256) {
        return type(uint256).max;
    }

    /// @notice Maximum amount of shares that can be minted from the Vault for the receiver, through a mint call.
    /// - return the maximum amount of shares mint would allow to be deposited to receiver
    ///   and not cause a revert, which MUST NOT be higher than the actual maximum
    ///   that would be accepted (it should underestimate if necessary).
    ///   This assumes that the user has infinite assets, i.e. MUST NOT rely on balanceOf of asset.
    /// - factor in both global and user-specific limits,
    ///   like if mints are entirely disabled (even temporarily) it MUST return 0.
    /// - return 2 ** 256 - 1 if there is no limit on the maximum amount of shares that may be minted.
    function maxMint(address) public view virtual returns (uint256) {
        return type(uint256).max;
    }

    /// @notice Maximum amount of the underlying asset that can be withdrawn from the owner balance in the Vault,
    /// through a withdraw call.
    /// - return the maximum amount of assets that could be transferred from owner through withdraw
    ///   and not cause a revert, which MUST NOT be higher than the actual maximum
    ///   that would be accepted (it should underestimate if necessary).
    /// - factor in both global and user-specific limits,
    ///   like if withdrawals are entirely disabled (even temporarily) it MUST return 0.
    function maxWithdraw(address owner) public view virtual returns (uint256) {
        return convertToAssets(balanceOf(owner));
    }

    /// @notice Maximum amount of Vault shares that can be redeemed from the owner balance in the Vault,
    /// through a redeem call.
    /// - return the maximum amount of shares that could be transferred from owner through redeem
    ///   and not cause a revert, which MUST NOT be higher than the actual maximum
    ///   that would be accepted (it should underestimate if necessary).
    /// - factor in both global and user-specific limits,
    ///   like if redemption is entirely disabled (even temporarily) it MUST return 0.
    function maxRedeem(address owner) public view virtual returns (uint256) {
        return balanceOf(owner);
    }

    /* //////////////////////////////// INTERNAL HOOKS //////////////////////////////// */

    /// @notice Called before withdraw will be made the Vault.
    /// @dev allow implement additional logic for withdraw, hooks a prefered way rather then wrapping
    function beforeWithdraw(uint256 assets, uint256 shares) internal virtual {}

    /// @notice Called when a deposit is made to the Vault.
    /// @dev allow implement additional logic for withdraw, hooks a prefered way rather then wrapping
    function afterDeposit(uint256 assets, uint256 shares) internal virtual {}
}
