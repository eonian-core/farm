// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.12;

import {
    SafeERC20,
    IERC20
} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

import {IOps} from './IOps.sol';



/// Based on https://github.com/gelatodigital/ops/blob/9a9cde6ab2f1b132b949f9244fd59a1de4da4123/contracts/vendor/gelato/OpsReady.sol
abstract contract OpsReady {

    IOps public immutable ops;
    address payable public immutable gelato;

    address public constant ETH = 0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE;

    using SafeERC20 for IERC20;

    modifier onlyOps() {
        require(msg.sender == address(ops), "OpsReady: onlyOps");
        _;
    }

    constructor(address _ops) {
        ops = IOps(_ops);
        gelato = ops.gelato();
    }

    function _payGalatoFee() internal {
        (uint256 fee, address feeToken) = ops.getFeeDetails();

        _payGalato(fee, feeToken);
    }

    function _payGalato(uint256 _amount, address _paymentToken) internal {
        if (_paymentToken == ETH) {
            (bool success, ) = gelato.call{value: _amount}("");
            require(success, "_transfer: ETH transfer failed");
            
            return;
        }
        
        IERC20(_paymentToken).safeTransfer(gelato, _amount);
    }
}