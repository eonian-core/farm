// SPDX-License-Identifier: AGPL-3.0
pragma solidity ^0.8.19;

import {Initializable} from "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

// solhint-disable-next-line contract-name-camelcase
contract Stub_ParentInvalidUpgrade is Initializable {
    uint256 public integerB;
    address public addressB;

    uint256[49] private __gap;

    function __Stub_Parent_init(
        uint256 _integerB,
        address _addressB
    ) internal onlyInitializing {
        __Stub_Parent_init_unchained(_integerB, _addressB);
    }

    function __Stub_Parent_init_unchained(
        uint256 _integerB,
        address _addressB
    ) internal onlyInitializing {
        setIntegerB(_integerB);
        setAddressB(_addressB);
    }

    function setIntegerB(uint256 _integerB) public {
        integerB = _integerB;
    }

    function setAddressB(address _addressB) public {
        addressB = _addressB;
    }
}