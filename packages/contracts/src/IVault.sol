// SPDX-License-Identifier: AGPL-3.0
pragma solidity ^0.8.19;

import {IERC20Upgradeable} from "@openzeppelin/contracts-upgradeable/token/ERC20/IERC20Upgradeable.sol";

import {ILender} from "./lending/ILender.sol";
import {IStrategiesLender} from "./lending/IStrategiesLender.sol";
import {IERC4626} from "./tokens/IERC4626.sol";

interface IVault is IStrategiesLender, IERC4626 { // solhint-disable-line no-empty-blocks

}
