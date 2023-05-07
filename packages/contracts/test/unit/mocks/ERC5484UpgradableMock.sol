/// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "contracts/Vault.sol";
import "../../../src/tokens/ERC5484Upgradeable.sol";

contract ERC5484UpgradableMock is ERC5484Upgradeable {
    constructor(
        string memory name_,
        string memory symbol_,
        BurnAuth burnAuth_,
        bool mintOnce_
    ) initializer {
        __SBTERC721Upgradeable_init(name_, symbol_, burnAuth_, mintOnce_);
    }
}