// SPDX-License-Identifier: AGPL-3.0-or-later
pragma solidity ^0.8.19;

import {Initializable} from "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

/** Implement best practices for initializable contracts */
contract SafeInitializable is Initializable {

    /**
     * This constructor prevent UUPS Uninitialized Proxies Vulnerability in all contracts which inherit from it
     * more info about vulnarability https://medium.com/immunefi/wormhole-uninitialized-proxy-bugfix-review-90250c41a43a
     * 
     * @dev Initial fix for this vulnarability was suggested as using `_disableInitializers()` function in constructor,
     *  but later, in version 4.3.2, OpenZepplin implemented `onlyProxy` modifier for UUPS upgradable contracts, 
     *  which fixed this vulnarability. Still `_disableInitializers()` is best practice which prevent unintended access 
     *  to implementation contracts which can be used for malicious purposes.
     *  
     *  More info: https://forum.openzeppelin.com/t/how-to-test-upgradeability-for-proxies/33436/7 
     *      and https://forum.openzeppelin.com/t/uupsupgradeable-vulnerability-post-mortem/15680
     * 
     * To prevent code dublication of cconstructor this contract can be used. On the other hand, 
     * it can be used as a marker for contracts which are safe from this vulnerability.
     * Additionaly `needDisableInitializers` parameter can be used to disable initializers in mocks and unit tests.
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