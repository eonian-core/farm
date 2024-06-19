// SPDX-License-Identifier: AGPL-3.0
pragma solidity ^0.8.26;

import {SafeERC20, IERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

import {IOps} from "./IOps.sol";
import {BackCombatibleTransfer} from "./BackCombatibleTransfer.sol";

import {SafeInitializable} from "../../upgradeable/SafeInitializable.sol";

error OpsOnlyAllowed();

/**
 * @notice Give basic methods to pay for Gelato operations.
 * @dev Inherit this contract to allow your smart contract to
 * - Make synchronous fee payments.
 * - Have call restrictions for functions to be automated.
 * 
 * In gelato docs and codebase named as AutomateReady, 
 * but it fully match with legacy OpsReady that we used in our contracts
 * To avoid unnecesary changes we will use OpsReady name
 * 
 * Based on 
 * - https://github.com/gelatodigital/automate-unit-testing/blob/main/contracts/gelato/AutomateReady.sol
 * - https://github.com/gelatodigital/ops/blob/9a9cde6ab2f1b132b949f9244fd59a1de4da4123/contracts/vendor/gelato/OpsReady.sol
 */
abstract contract OpsReady is SafeInitializable {
    IOps public ops;
    address payable public gelato;

    using BackCombatibleTransfer for address payable;
    using SafeERC20 for IERC20;

    /**
     * @dev This empty reserved space is put in place to allow future versions to add new
     * variables without shifting down storage in the inheritance chain.
     * See https://docs.openzeppelin.com/contracts/4.x/upgradeable#storage_gaps
     */
    uint256[50] private __gap;

    /**
     * @dev
     * Only tasks from ops, defined in constructor, can call
     * the functions with this modifier.
     */
    modifier onlyOps() {
        if(msg.sender != address(ops)) {
            revert OpsOnlyAllowed();
        }
        _;
    }
 
    /**
     * Contructor of contract which will be able to communicate with Gelato protocol
     * @param _ops - address of the Ops contract.
     * @dev addresses can be found at https://docs.gelato.network/developer-products/gelato-ops-smart-contract-automation-hub/contract-addresses
     */
    function __OpsReady_init(IOps _ops) internal onlyInitializing {
        ops = _ops;
        gelato = ops.gelato();
    }

    /**
     * @notice Will pay bot for executed task through galato
     * @dev
     * Transfers fee to gelato for synchronous fee payments.
     *
     * fee & feeToken should be queried from IAutomate.getFeeDetails()
     */
    function _payGalatoFee() internal {
        (uint256 fee, address feeToken) = _getFeeDetails();

        gelato.backCombatibleTransfer(feeToken, fee);
    }

    function _getFeeDetails() internal view returns (uint256 fee, address feeToken) {
        (fee, feeToken) = ops.getFeeDetails();
    }
}
