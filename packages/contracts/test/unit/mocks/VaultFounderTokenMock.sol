// SPDX-License-Identifier: AGPL-3.0-only
pragma solidity ^0.8.19;

import {VaultFounderToken} from "contracts/tokens/VaultFounderToken.sol";

contract VaultFounderTokenMock is VaultFounderToken {
    constructor(
        uint256 maxCountTokens_,
        uint256 nextTokenPriceMultiplier_,
        uint256 initialTokenPrice_
    ) VaultFounderToken(false) {
        initialize(
            maxCountTokens_,
            nextTokenPriceMultiplier_,
            initialTokenPrice_
        );
    }
}