// SPDX-License-Identifier: GNU AGPLv3
pragma solidity ^0.8.26;

import {UUPSUpgradeable} from "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import {OwnableUpgradeable} from "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import {SafeInitializable} from "./SafeInitializable.sol";

/** 
 * Implement basic safety mechanism for UUPS proxy
 * based on owner authorization for upgrades
 * */
abstract contract SafeUUPSUpgradeable is UUPSUpgradeable, SafeInitializable, OwnableUpgradeable {

    /**
     * @dev This empty reserved space is put in place to allow future versions to add new
     * variables without shifting down storage in the inheritance chain.
     * See https://docs.openzeppelin.com/contracts/4.x/upgradeable#storage_gaps
     */
    uint256[50] private __gap;

    /** Init all required constructors, including ownable */
    function __SafeUUPSUpgradeable_init() internal onlyInitializing {
        __SafeUUPSUpgradeable_init_direct();

        __Ownable_init();
    }

    /** Init only direct constructors, UUPS only */
    function __SafeUUPSUpgradeable_init_direct() internal onlyInitializing {
        __UUPSUpgradeable_init();
    }

    /** Authorise that upgrades can do only owner */
    function _authorizeUpgrade(address newImplementation) internal onlyOwner override {} // solhint-disable-line no-empty-blocks
}
