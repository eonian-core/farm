// SPDX-License-Identifier: AGPL-3.0-only
pragma solidity ^0.8.19;

import {VaultFounderToken} from "contracts/tokens/VaultFounderToken.sol";

contract VaultFounderTokenMock is VaultFounderToken {
    constructor(
        address admin_
    ) initializer {
        __VaultFounderToken_init(3, 120, 200, admin_);
    }
}