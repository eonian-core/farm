// SPDX-License-Identifier: GNU AGPLv3
pragma solidity ^0.8.26;

import {IStrategiesLender} from "./lending/IStrategiesLender.sol";
import {IERC4626} from "./tokens/IERC4626.sol";

interface IVault is IStrategiesLender, IERC4626 { // solhint-disable-line no-empty-blocks

}
