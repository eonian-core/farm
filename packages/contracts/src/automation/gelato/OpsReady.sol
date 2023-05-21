// SPDX-License-Identifier: AGPL-3.0-or-later
pragma solidity ^0.8.19;

import {SafeERC20, IERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import {Initializable} from "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

import {IOps} from "./IOps.sol";
import {BackCombatibleTransfer} from "./BackCombatibleTransfer.sol";

/// Based on https://github.com/gelatodigital/ops/blob/9a9cde6ab2f1b132b949f9244fd59a1de4da4123/contracts/vendor/gelato/OpsReady.sol
/// @notice Give basic methods to pay for Gelato operations.
abstract contract OpsReady is Initializable {
    IOps public ops;
    address payable public gelato;

    using BackCombatibleTransfer for address payable;
    using SafeERC20 for IERC20;

    modifier onlyOps() {
        require(msg.sender == address(ops), "OpsReady: onlyOps");
        _;
    }

    /**
     * @dev This empty reserved space is put in place to allow future versions to add new
     * variables without shifting down storage in the inheritance chain.
     * See https://docs.openzeppelin.com/contracts/4.x/upgradeable#storage_gaps
     */
    uint256[50] private __gap;

    // ------------------------------------------ Constructors ------------------------------------------

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor(bool needDisableInitializers) {
        // Solve the Uninitialized Proxies Vulnerability 
        // more info https://medium.com/immunefi/wormhole-uninitialized-proxy-bugfix-review-90250c41a43a
        // but can be disabled for mocks
        if(needDisableInitializers) {
            _disableInitializers();
        }
    }

    /**
     * Contructor of contract which will be able to communicate with Gelato protocol
     * @param _ops - address of the Ops contract.
     * @dev addresses can be found at https://docs.gelato.network/developer-products/gelato-ops-smart-contract-automation-hub/contract-addresses
     */
    function __OpsReady_init(address _ops) internal onlyInitializing {
        ops = IOps(_ops);
        gelato = ops.gelato();
    }

    /// @notice Will pay bot for executed task through galato
    function _payGalatoFee() internal {
        (uint256 fee, address feeToken) = ops.getFeeDetails();

        gelato.backCombatibleTransfer(feeToken, fee);
    }
}
