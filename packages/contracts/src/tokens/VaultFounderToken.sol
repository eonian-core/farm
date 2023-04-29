// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./SBTERC721Upgradeable.sol";

contract VaultFounderToken is SBTERC721Upgradeable {
    constructor() initializer {
        __SafeSBTERC721Upgradeable_init("Eonian Soul Bound founder token", "ESBT");
    }
}