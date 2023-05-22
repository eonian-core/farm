/// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "contracts/upgradeable/SafeInitializable.sol";

/** Disable initializable checks to allow implementation contract work same way as proxy */
contract SafeInitializableMock is SafeInitializable(false) {

}