// SPDX-License-Identifier: GNU AGPLv3
pragma solidity ^0.8.26;

import {AccessControlUpgradeable} from "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import {IERC165Upgradeable} from "@openzeppelin/contracts-upgradeable/utils/introspection/IERC165Upgradeable.sol";

import {SafeInitializable} from "../upgradeable/SafeInitializable.sol";
import {SafeUUPSUpgradeable} from "../upgradeable/SafeUUPSUpgradeable.sol";
import {IVersionable} from "../upgradeable/IVersionable.sol";
import {ERC5484Upgradeable} from "./ERC5484Upgradeable.sol";
import {IVaultFounderToken} from "./IVaultFounderToken.sol";
import {IVaultHook, ERC4626HookPayload} from "./IVaultHook.sol";
import {RewardHolder} from "./RewardHolder.sol";
import {Vault} from "../Vault.sol";

contract VaultFounderToken is IVaultFounderToken, SafeUUPSUpgradeable, ERC5484Upgradeable, IVaultHook, RewardHolder {

    uint256 public constant MAX_BPS = 10_000;

    // Max number of tokens that can be minted
    uint256 public maxCountTokens;

    // Next token price multiplier in percents
    uint256 public nextTokenPriceMultiplier;

    /// @dev return price for the next token
    uint256 public nextTokenPrice;

    /// @dev This empty reserved space is put in place to allow future versions to add new
    /// variables without shifting down storage in the inheritance chain.
    /// See https://docs.openzeppelin.com/contracts/4.x/upgradeable#storage_gaps
    uint256[50] private __gap;

    /// @notice Emit when new token minted and token price updated.
    /// @param founder Address of the founder.
    /// @param requiredPrice Required price for the token.
    /// @param tokenPrice Price of the token.
    /// @param nextTokenPrice Price of the next token.
    /// @param nextTokenPriceMultiplier Next token price multiplier in percents.
    event FounderAdded(
        address indexed founder, 
        uint256 requiredPrice,
        uint256 tokenPrice, 
        uint256 nextTokenPrice, 
        uint256 nextTokenPriceMultiplier
    );

    /* ///////////////////////////// CONSTRUCTORS ///////////////////////////// */

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor(bool needDisableInitializers) SafeInitializable(needDisableInitializers) {} // solhint-disable-line no-empty-blocks

    function initialize(
        uint256 maxCountTokens_,
        uint256 nextTokenPriceMultiplier_,
        uint256 initialTokenPrice_,
        string memory name_,
        string memory symbol_,
        Vault vault_
    ) public initializer {
        __SafeUUPSUpgradeable_init(); // owner init under the hood
        __ERC5484Upgradeable_init(name_, symbol_, BurnAuth.Neither, true); // __AccessControl_init inside
        __ReentrancyGuard_init();
        __RewardHolder_init_unchained(); // require __AccessControl_init

        maxCountTokens = maxCountTokens_;
        nextTokenPriceMultiplier = nextTokenPriceMultiplier_;
        nextTokenPrice = initialTokenPrice_;

        setVault(vault_);
    }

    /// @inheritdoc IVersionable
    function version() external pure returns (string memory) {
        return "0.2.1";
    }

    /// @dev set vault
    /// @notice that is mandatory to be set before reward can be claimed
    function setVault(Vault vault_) public onlyRole(DEFAULT_ADMIN_ROLE) {
        if(address(vault) != address(0)) {
            revokeRole(MINTER_ROLE, address(vault_));
        }

        super._setVault(vault_);
        grantRole(MINTER_ROLE, address(vault_));
    }

    /// @dev function for mint new SBT token
    /// @param to address of user who will receive token
    /// @param uri token metadata uri
    /// @param amount holder balance, used as token price
    /// @return true if token was minted
    function tryToMint(address to, string memory uri, uint256 amount) public virtual onlyRole(MINTER_ROLE) returns(bool){
        if(amount < nextTokenPrice || totalSupply() >= maxCountTokens) {
            return false;
        }
        
        if(!_safeMint(to, uri)) { 
            return false;
        }

        addOwner(to);
        uint256 _nextTokenPrice = amount * nextTokenPriceMultiplier / MAX_BPS;

        // Will be used to record price of current holder token in The Graph
        emit FounderAdded(to, nextTokenPrice, amount, _nextTokenPrice, nextTokenPriceMultiplier);
        
        nextTokenPrice = _nextTokenPrice;
        return true;
    }

    /// @dev set multiplicator for the next token in percents
    /// in case nextTokenPriceMultiplier_ = 13_000 the next price of the token will be: curPrice * 130%
    /// @param nextTokenPriceMultiplier_ persent multiplicator
    function setNextTokenMultiplier(uint256 nextTokenPriceMultiplier_) external onlyRole(DEFAULT_ADMIN_ROLE) {
        // the price of the previous token
        nextTokenPrice = nextTokenPrice * MAX_BPS / nextTokenPriceMultiplier;
        nextTokenPriceMultiplier = nextTokenPriceMultiplier_;
        // calculation the price with the new multiplier
        nextTokenPrice = nextTokenPrice * nextTokenPriceMultiplier_ / MAX_BPS;
    }

    /// @inheritdoc IVaultFounderToken
    function setTokenURI(string memory _tokenURI) external override {
        address tokenOwner = msg.sender;
        uint256 tokenId = tokenOfOwnerByIndex(tokenOwner, 0);
        _setTokenURI(tokenId, _tokenURI);
    }

    /// @inheritdoc IVaultFounderToken
    function setTokenURI(string memory _tokenURI, uint256 tokenId) external override onlyRole(DEFAULT_ADMIN_ROLE) {
        _setTokenURI(tokenId, _tokenURI);
    }

    function afterDepositTrigger(ERC4626HookPayload memory request)
            external override
    {
        tryToMint(request.requestSender, "", request.senderMaxWithdraw);
    }

    /// @dev See {IERC165-supportsInterface}.
    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC5484Upgradeable, AccessControlUpgradeable, IERC165Upgradeable)
        virtual
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}