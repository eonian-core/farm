// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.12;

import {
    SafeERC20,
    IERC20
} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

address constant ETH = 0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE;

/// Copy of https://github.com/gelatodigital/ops/blob/9a9cde6ab2f1b132b949f9244fd59a1de4da4123/contracts/vendor/gelato/FGelato.sol
// solhint-disable private-vars-leading-underscore
// solhint-disable func-visibility
function _transfer(
    address payable _to,
    address _paymentToken,
    uint256 _amount
) {
    if (_paymentToken == ETH) {
        (bool success, ) = _to.call{value: _amount}("");
        require(success, "_transfer: ETH transfer failed");
    } else {
        SafeERC20.safeTransfer(IERC20(_paymentToken), _to, _amount);
    }
}