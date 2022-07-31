// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.12;

import {SafeERC20, IERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

/// @notice Library which support add support of transfers in ERC20 and native tokens together.
/// @dev Based of https://github.com/gelatodigital/ops/blob/9a9cde6ab2f1b132b949f9244fd59a1de4da4123/contracts/vendor/gelato/FGelato.sol
library BackCombatibleTransfer {
    address constant ETH = 0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE;

    /// @notice Backcombatible transfer to given address, will use ERC20 transfer if given token is ERC20.
    function backCombatibleTransfer(
        address payable to,
        address paymentToken,
        uint256 amount
    ) public {
        if (paymentToken == ETH) {
            safeNativeTransfer(to, amount);
            return;
        }

        SafeERC20.safeTransfer(IERC20(paymentToken), to, amount);
    }

    /// @notice Native token transfer, which check `call` result.
    function safeNativeTransfer(address payable to, uint256 amount) public {
        // Not use `transfer` or `send` as they considered as bad praqctice after Istanbul hardfork.
        (bool success, ) = to.call{value: amount}("");
        require(success, "Native transfer failed");
    }
}
