// SPDX-License-Identifier: AGPL-3.0-only
pragma solidity ^0.8.4;

import {Vault} from "contracts/Vault.sol";
import {ERC5484Upgradeable} from "contracts/tokens/ERC5484Upgradeable.sol";

contract ERC5484UpgradableMock is ERC5484Upgradeable {
    constructor(
        string memory name_,
        string memory symbol_,
        BurnAuth burnAuth_,
        bool mintOnce_
    ) initializer {
        __ERC5484Upgradeable_init(name_, symbol_, burnAuth_, mintOnce_);
    }

    function safeMint(address to, string memory uri)
        public
        returns(bool)
    {
        return _safeMint(to, uri);
    }
}