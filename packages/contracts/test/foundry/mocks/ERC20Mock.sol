// SPDX-License-Identifier: AGPL-3.0-only
pragma solidity >=0.8.0;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract ERC20Mock is ERC20 {
    uint8 _decimals = 18;

    constructor(string memory _name, string memory _symbol)
        ERC20(_name, _symbol)
    {}

    function setDecimals(uint8 __decimals) public {
        _decimals = __decimals;
    }

    function mint(address to, uint256 value) public virtual {
        _mint(to, value);
    }

    function burn(address from, uint256 value) public virtual {
        _burn(from, value);
    }

    function decimals() public view override returns (uint8) {
        return _decimals;
    }
}
