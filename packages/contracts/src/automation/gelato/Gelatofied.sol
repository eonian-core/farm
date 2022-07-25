// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.12;

import {
    SafeERC20,
    IERC20
} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import {_transfer, ETH} from "./FGelato.sol";

/// Based on https://github.com/gelatodigital/ops/blob/9a9cde6ab2f1b132b949f9244fd59a1de4da4123/contracts/vendor/gelato/Gelatofied.sol
abstract contract Gelatofied {
    address payable public immutable gelato;

    modifier gelatofy(uint256 _amount, address _paymentToken) {
        require(msg.sender == gelato, "Gelatofied: Only gelato");
        _;
        _transfer(gelato, _paymentToken, _amount);
    }

    modifier onlyGelato() {
        require(msg.sender == gelato, "Gelatofied: Only gelato");
        _;
    }

    constructor(address payable _gelato) {
        gelato = _gelato;
    }
}