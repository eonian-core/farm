// SPDX-License-Identifier: AGPL-3.0-or-later
pragma solidity ^0.8.0;

import "./ERC5484Upgradeable.sol";
import "./IVaultFounderToken.sol";
import "./IVaultHook.sol";

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
        uint256 initialTokenPrice_
    ) internal onlyInitializing {
        __SBTERC721Upgradeable_init("Eonian Soul Bound founder token", "ESBT", BurnAuth.Neither, true);
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

    function setTokenURI(string memory _tokenURI) external override {
        address tokenOwner = msg.sender;
        uint256 tokenId = tokenOfOwnerByIndex(tokenOwner, 0);
        _setTokenURI(tokenId, _tokenURI);
    }

    function afterDepositTrigger(ERC4626Upgradeable vault, uint256 /* assets */, uint256 /* shares */) external {
        if(vault.maxWithdraw(msg.sender) >= _nextTokenPrice()) {
            safeMint(msg.sender, "");
        }
    }

    function beforeWithdrawTrigger(ERC4626Upgradeable vault, uint256 assets, uint256 shares) external {
        // empty body
    }
}