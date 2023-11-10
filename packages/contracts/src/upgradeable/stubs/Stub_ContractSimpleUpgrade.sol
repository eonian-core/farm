// SPDX-License-Identifier: AGPL-3.0
pragma solidity ^0.8.19;

import {SafeInitializable} from "../SafeInitializable.sol";
import {SafeUUPSUpgradeable} from "../SafeUUPSUpgradeable.sol";

// solhint-disable-next-line contract-name-camelcase
contract Stub_ContractSimpleUpgrade is SafeUUPSUpgradeable {
    uint256 public integerA;
    address public addressA;

    uint256 public integerB;

    uint256[49] private __gap;

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor(bool needDisableInitializers) SafeInitializable(needDisableInitializers) {} // solhint-disable-line no-empty-blocks
    
    function initialize(
        uint256 _integerA,
        address _addressA
    ) public initializer {
        __SafeUUPSUpgradeable_init(); // owner init under the hood

        setIntegerA(_integerA);
        setAddressA(_addressA);
    }

    function setIntegerA(uint256 _integerA) public onlyOwner {
        integerA = _integerA;
    }

    function setAddressA(address _addressA) public onlyOwner {
        addressA = _addressA;
    }

    function setIntegerB(uint256 _integerB) public onlyOwner {
        integerB = _integerB;
    }

    function version() external pure override returns (string memory) {
        return "0.0.1-contract";
    }
}