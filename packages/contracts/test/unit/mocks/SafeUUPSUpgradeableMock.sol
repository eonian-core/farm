/// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "contracts/upgradeable/SafeUUPSUpgradeable.sol";
import "./SafeInitializableMock.sol";

contract SafeUUPSUpgradeableMock is SafeUUPSUpgradeable, SafeInitializableMock {
    
    function __SafeUUPSUpgradeableMock_init() external initializer {
        __SafeUUPSUpgradeable_init();
    }

    function authorizeUpgrade(address newImplementation) public {
        _authorizeUpgrade(newImplementation);
    }

}
