// SPDX-License-Identifier: AGPL-3.0-only
pragma solidity ^0.8.19;

import "contracts/tokens/VaultFounderToken.sol";

contract VaultFounderTokenMock is VaultFounderToken {
    constructor(
        uint256 maxCountTokens_,
        uint256 nextTokenPriceMultiplier_,
        uint256 initialTokenPrice_,
        Vault vault_
    ) VaultFounderToken(false) {
        initialize(
            maxCountTokens_,
            nextTokenPriceMultiplier_,
            initialTokenPrice_,
            "Vault Founder Token",
            "VFT",
            vault_
        );
    }
}