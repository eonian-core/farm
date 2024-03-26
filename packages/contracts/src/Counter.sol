// SPDX-License-Identifier: AGPL-3.0
pragma solidity ^0.8.19;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";

contract Counter is Initializable, UUPSUpgradeable, OwnableUpgradeable {
    uint256 public num;

    uint256[50] private __gap;

    function initialize(uint256 _num) public initializer {
        num = _num;

        __Ownable_init();
    }

    function _authorizeUpgrade(address) internal override onlyOwner {}

    function inc() public {
        num += 1;
    }


    function dec() public {
        require(num > 0, "cannot be negative");
        num -= 1;
    }
}