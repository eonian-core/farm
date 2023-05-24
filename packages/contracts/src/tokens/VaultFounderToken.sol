// SPDX-License-Identifier: AGPL-3.0-or-later
pragma solidity ^0.8.19;

import {ERC5484Upgradeable} from "./ERC5484Upgradeable.sol";
import {ERC4626Upgradeable} from "./ERC4626Upgradeable.sol";
import {IVaultFounderToken} from "./IVaultFounderToken.sol";
import {IVaultHook} from "./IVaultHook.sol";

contract VaultFounderToken is IVaultFounderToken, ERC5484Upgradeable, IVaultHook {

    // Max number of tokens that can be minted
    uint256 private _maxCountTokens;

    // Next token price multiplier in percents
    uint256 private _nextTokenPriceMultiplier;

    // Initial token price
    uint256 private _initialTokenPrice;

    //todo discuss if those parameters should be in constructor or not
    function __VaultFounderToken_init(
        uint256 maxCountTokens_,
        uint256 nextTokenPriceMultiplier_,
        uint256 initialTokenPrice_,
        address admin_
    ) internal onlyInitializing {
        __ERC5484Upgradeable_init("Eonian Soul Bound founder token", "ESBT", BurnAuth.Neither, true, admin_);
        _maxCountTokens = maxCountTokens_;
        _nextTokenPriceMultiplier = nextTokenPriceMultiplier_;
        _initialTokenPrice = initialTokenPrice_;
    }

    function _safeMint(address to, uint256 tokenId) internal override {
        require(totalSupply() < _maxCountTokens, "ESBT: max number of tokens");
        super._safeMint(to, tokenId);
    }

    function priceOf(uint256 tokenId) external view returns (uint256) {
        require(tokenId < totalSupply(), "ESBT: Token does not exist");
        return _priceOf(tokenId);
    }

    function _priceOf(uint256 tokenId) internal view returns (uint256) {
        uint256 price = _initialTokenPrice;
        for (uint256 i = 0; i < tokenId; i++) {
            price = (price * _nextTokenPriceMultiplier) / 100;
        }
        return price;
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

    function afterDepositTrigger(
        ERC4626Upgradeable vault,
        uint256 /*assets*/,
        uint256 /*shares*/,
        address user
    ) external {
        if(vault.maxWithdraw(user) >= _nextTokenPrice()) {
            safeMint(address(user), "");
        }
    }

    /* solhint-disable no-empty-blocks */
    function beforeWithdrawTrigger(
        ERC4626Upgradeable vault,
        uint256 /* assets */,
        uint256 /* shares */,
        address user
    ) external {
        // empty
    }
    /* solhint-disable no-empty-blocks */
}