// SPDX-License-Identifier: AGPL-3.0
pragma solidity ^0.8.19;

import {Initializable} from "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import {IVersionable} from './IVersionable.sol';

/** Implement best practices for initializable contracts */
abstract contract SafeInitializable is IVersionable, Initializable {

    /**
     * @dev This empty reserved space is put in place to allow future versions to add new
     * variables without shifting down storage in the inheritance chain.
     * See https://docs.openzeppelin.com/contracts/4.x/upgradeable#storage_gaps
     */
    uint256[50] private __gap;

    /**
     * This constructor prevents UUPS Uninitialized Proxies Vulnerability in all contracts which inherit from it.
     * More info about vulnerability: https://medium.com/immunefi/wormhole-uninitialized-proxy-bugfix-review-90250c41a43a
     * 
     * @dev Initial fix for this vulnerability was suggested as using `_disableInitializers()` function in constructor,
     *  but later, in version 4.3.2, OpenZeppelin implemented `onlyProxy` modifier for UUPS upgradable contracts,
     *  which fixed this vulnerability. Still, `_disableInitializers()` is a best practice which prevents unintended access 
     *  to implementation contracts that can be used maliciously.
     *  
     *  More info: https://forum.openzeppelin.com/t/how-to-test-upgradeability-for-proxies/33436/7 
     *      and https://forum.openzeppelin.com/t/uupsupgradeable-vulnerability-post-mortem/15680
     * 
     * To prevent code duplication of constructor, this contract can be used. On the other hand, 
     * it can be used as a marker for contracts that are safe from this vulnerability.
     * Additionally, `needDisableInitializers` parameter can be used to enable initializers in mocks and unit tests.
     *
     * @param needDisableInitializers - if true, initializers will be disabled
     */
    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor(bool needDisableInitializers) {
        if(needDisableInitializers) {
            _disableInitializers();
        }
    }
}