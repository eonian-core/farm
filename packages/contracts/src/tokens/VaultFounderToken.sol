// SPDX-License-Identifier: AGPL-3.0-or-later
pragma solidity ^0.8.0;

import "./SBTERC721Upgradeable.sol";
import "./IVaultFounderToken.sol";

contract VaultFounderToken is IVaultFounderToken, SBTERC721Upgradeable {

    // Max number of tokens that can be minted
    uint256 private _maxCountTokens;

    // Next token price multiplier in percents
    uint256 private _nextTokenPriceMultiplier;

    // Initial token price
    uint256 private _initialTokenPrice;

    function __VaultFounderToken_init(
        uint256 maxCountTokens_,
        uint256 nextTokenPriceMultiplier_,
        uint256 initialTokenPrice_
    ) internal onlyInitializing {
        __SBTERC721Upgradeable_init("Eonian Soul Bound founder token", "ESBT");
        _maxCountTokens = maxCountTokens_;
        _nextTokenPriceMultiplier = nextTokenPriceMultiplier_;
        _initialTokenPrice = initialTokenPrice_;
    }

    function _safeMint(address to, uint256 tokenId) internal override {
        require(totalSupply() < _maxCountTokens, "VaultFounderToken: max number of tokens reached");
        super._safeMint(to, tokenId);
    }

    function priceOf(uint256 tokenId) external view returns (uint256) {
        require(tokenId < totalSupply(), "VaultFounderToken: Token does not exist");
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
}