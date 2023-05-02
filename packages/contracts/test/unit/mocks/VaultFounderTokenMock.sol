/// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "contracts/Vault.sol";
import "../../../src/tokens/VaultFounderToken.sol";

contract VaultFounderTokenMock is VaultFounderToken {
    constructor() initializer {
        __VaultFounderToken_init(3, 120, 200);
    }
}