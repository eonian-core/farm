// SPDX-License-Identifier: AGPL-3.0-only
pragma solidity ^0.8.19;

import {VaultFounderToken} from "contracts/tokens/VaultFounderToken.sol";

contract VaultFounderTokenMock is VaultFounderToken {
    constructor(
        address admin_
    ) VaultFounderToken(false) {
        initialize(
            3,
            12_000,
            200,
            admin_
        );
    }
}