/// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "contracts/upgradeable/SafeInitializable.sol";

/** Disable initializable checks to allow implementation contract work same way as proxy */
contract SafeInitializableMock is SafeInitializable(false) {

}

/** Version of SafeInitializable for testing */
contract SafeInitializableImpl is SafeInitializable {

    constructor(bool needDisableInitializers) SafeInitializable(needDisableInitializers) {

    }

    function __SafeInitializableImpl_init() external initializer returns (bool)  {
        return true;
    }

}