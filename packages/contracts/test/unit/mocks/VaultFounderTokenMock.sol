// SPDX-License-Identifier: AGPL-3.0-or-later
pragma solidity ^0.8.0;

import "../../../src/tokens/VaultFounderToken.sol";

contract VaultFounderTokenMock is VaultFounderToken {
    constructor() initializer {
        __VaultFounderToken_init(3, 120, 200);
    }
}