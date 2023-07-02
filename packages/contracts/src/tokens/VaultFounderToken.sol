// SPDX-License-Identifier: AGPL-3.0
pragma solidity ^0.8.19;

import {AccessControlUpgradeable} from "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import {IERC165Upgradeable} from "@openzeppelin/contracts-upgradeable/utils/introspection/IERC165Upgradeable.sol";
import {ERC721Upgradeable} from "@openzeppelin/contracts-upgradeable/token/ERC721/ERC721Upgradeable.sol";
import {ERC721URIStorageUpgradeable} from "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721URIStorageUpgradeable.sol";

import {SafeInitializable} from "../upgradeable/SafeInitializable.sol";
import {SafeUUPSUpgradeable} from "../upgradeable/SafeUUPSUpgradeable.sol";
import {IVersionable} from "../upgradeable/IVersionable.sol";
import {ERC5484Upgradeable} from "./ERC5484Upgradeable.sol";
import {ERC4626Upgradeable} from "./ERC4626Upgradeable.sol";
import {IVaultFounderToken} from "./IVaultFounderToken.sol";
import {IVaultHook, ERC4626UpgradeableRequest} from "./IVaultHook.sol";
import {RewardHolder} from "./RewardHolder.sol";

contract VaultFounderToken is IVaultFounderToken, SafeUUPSUpgradeable, ERC5484Upgradeable, IVaultHook, RewardHolder {

    // Max number of tokens that can be minted
    uint256 private _maxCountTokens;

    // Next token price multiplier in percents
    uint256 private _nextTokenPriceMultiplier;

    // Initial token price
    uint256 private _initialTokenPrice;

    // Cache to save gas for nextTokenPrice calculation
    bool private _nextPriceToBeUpdated = true;
    uint256 private _nextPriceCache;

    /// @dev This empty reserved space is put in place to allow future versions to add new
    /// variables without shifting down storage in the inheritance chain.
    /// See https://docs.openzeppelin.com/contracts/4.x/upgradeable#storage_gaps
    uint256[46] private __gap;

    /* ///////////////////////////// CONSTRUCTORS ///////////////////////////// */

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor(bool needDisableInitializers) SafeInitializable(needDisableInitializers) {} // solhint-disable-line no-empty-blocks

    function initialize(
        uint256 maxCountTokens_,
        uint256 nextTokenPriceMultiplier_,
        uint256 initialTokenPrice_
    ) public initializer {
        __SafeUUPSUpgradeable_init_direct();
        __ERC5484Upgradeable_init("Eonian Vault Founder Token", "EVFT", BurnAuth.Neither, true);
        __RewardHolder_init();
        _maxCountTokens = maxCountTokens_;
        _nextTokenPriceMultiplier = nextTokenPriceMultiplier_;
        _initialTokenPrice = initialTokenPrice_;
    }

    /// @inheritdoc IVersionable
    function version() external pure returns (string memory) {
        return "0.1.0";
    }

    /// @dev function for mint new SBT token
    /// @param to address of user who will receive token
    /// @param uri token metadata uri
    /// @return true if token was minted
    function safeMint(address to, string memory uri) public virtual override(ERC5484Upgradeable) returns(bool){
        if(totalSupply() < _maxCountTokens) {
            bool tokenCreated = super.safeMint(to, uri);
            if(tokenCreated) {
                setupNewOwner(to);
                return true;
            }
        }
        return false;
    }

    /// @inheritdoc ERC721Upgradeable
    function _safeMint(address to, uint256 tokenId) internal override {
        require(totalSupply() < _maxCountTokens, "EVFT: max number of tokens");
        _nextPriceToBeUpdated = true;
        super._safeMint(to, tokenId);
    }

    /// @inheritdoc IVaultFounderToken
    function priceOf(uint256 tokenId) external view returns (uint256) {
        require(tokenId < totalSupply(), "EVFT: Token does not exist");
        return _priceOf(tokenId);
    }

    /// @dev internal implementation for calculate price for the next token based on
    /// the current sequential token id
    function _priceOf(uint256 tokenId) internal view returns (uint256) {
        uint256 price = _initialTokenPrice;
        for (uint256 i = 0; i < tokenId; i++) {
            price = (price * _nextTokenPriceMultiplier) / 10_000;
        }
        return price;
    }

    /// @dev set multiplicator for the next token in percents
    /// in case nextTokenPriceMultiplier_ = 13_000 the next price of the token will be: curPrice * 130%
    /// @param nextTokenPriceMultiplier_ persent multiplicator
    function setNextTokenMultiplier(uint256 nextTokenPriceMultiplier_) external onlyRole(DEFAULT_ADMIN_ROLE) {
        _nextTokenPriceMultiplier = nextTokenPriceMultiplier_;
    }

    /// @inheritdoc IVaultFounderToken
    function nextTokenPrice() external returns (uint256){
        return _nextTokenPrice();
    }

    /// @dev calculate price for the next token
    function _nextTokenPrice() internal returns (uint256){
        if(_nextPriceToBeUpdated) { // cache for gas optimization
            _nextPriceCache = _priceOf(totalSupply());
            _nextPriceToBeUpdated = false;
        }
        return _nextPriceCache;
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

    function afterDepositTrigger(ERC4626UpgradeableRequest memory request)
            external override
    {
        if(request.senderMaxWithdraw >= _nextTokenPrice()) {
            safeMint(request.requestSender, "");
        }
    }

    /* solhint-disable no-empty-blocks */
    function beforeWithdrawTrigger(ERC4626UpgradeableRequest memory request) external override
    {
        //empty code
    }
    /* solhint-disable no-empty-blocks */

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