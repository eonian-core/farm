// SPDX-License-Identifier: AGPL-3.0-or-later
pragma solidity ^0.8.19;

import {ERC5484Upgradeable} from "./ERC5484Upgradeable.sol";
import {ERC4626Upgradeable} from "./ERC4626Upgradeable.sol";
import {IVaultFounderToken} from "./IVaultFounderToken.sol";
import {IVaultHook, ERC4626UpgradeableRequest} from "./IVaultHook.sol";

contract VaultFounderToken is IVaultFounderToken, ERC5484Upgradeable, IVaultHook {

    // Max number of tokens that can be minted
    uint256 private _maxCountTokens;

    // Next token price multiplier in percents
    uint256 private _nextTokenPriceMultiplier;

    // Initial token price
    uint256 private _initialTokenPrice;

    /// @dev This empty reserved space is put in place to allow future versions to add new
    /// variables without shifting down storage in the inheritance chain.
    /// See https://docs.openzeppelin.com/contracts/4.x/upgradeable#storage_gaps
    uint256[46] private __gap;

    function __VaultFounderToken_init(
        uint256 maxCountTokens_,
        uint256 nextTokenPriceMultiplier_,
        uint256 initialTokenPrice_,
        address admin_
    ) internal onlyInitializing {
        __ERC5484Upgradeable_init("Eonian Vault Founder Token", "EVFT", BurnAuth.Neither, true, admin_);
        _maxCountTokens = maxCountTokens_;
        _nextTokenPriceMultiplier = nextTokenPriceMultiplier_;
        _initialTokenPrice = initialTokenPrice_;
    }

    function _safeMint(address to, uint256 tokenId) internal override {
        require(totalSupply() < _maxCountTokens, "EVFT: max number of tokens");
        super._safeMint(to, tokenId);
    }

    function priceOf(uint256 tokenId) external view returns (uint256) {
        require(tokenId < totalSupply(), "EVFT: Token does not exist");
        return _priceOf(tokenId);
    }

    function _priceOf(uint256 tokenId) internal view returns (uint256) {
        uint256 price = _initialTokenPrice;
        for (uint256 i = 0; i < tokenId; i++) {
            price = (price * _nextTokenPriceMultiplier) / 100;
        }
        return price;
    }

    function setNextTokenMultiplier(uint256 nextTokenPriceMultiplier_) external onlyRole(DEFAULT_ADMIN_ROLE) {
        _nextTokenPriceMultiplier = nextTokenPriceMultiplier_;
    }

    function nextTokenPrice() external view returns (uint256){
        return _nextTokenPrice();
    }

    function _nextTokenPrice() internal view returns (uint256){
        return _priceOf(totalSupply());
    }

    function setTokenURI(string memory _tokenURI) external override {
        address tokenOwner = msg.sender;
        uint256 tokenId = tokenOfOwnerByIndex(tokenOwner, 0);
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
}