// SPDX-License-Identifier: AGPL-3.0
pragma solidity ^0.8.26;

import {SafeERC20, IERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

error NativeTransferFailed();

/// @notice Library that adding support for ERC20 and native tokens transfers.
/// @dev Based of https://github.com/gelatodigital/ops/blob/9a9cde6ab2f1b132b949f9244fd59a1de4da4123/contracts/vendor/gelato/FGelato.sol
library BackCombatibleTransfer {
    address public constant ETH = 0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE;

    /// @notice Backcombatible transfer to given address, will use ERC20 transfer if given token is ERC20.
    function backCombatibleTransfer(
        address payable to,
        address paymentToken,
        uint256 amount
    ) internal {
        if (paymentToken == ETH) {
            safeNativeTransfer(to, amount);
            return;
        }

        SafeERC20.safeTransfer(IERC20(paymentToken), to, amount);
    }

    /// @notice Native token transfer that checks `call` result.
    function safeNativeTransfer(address payable to, uint256 amount) internal {
        // We don't use `transfer` or `send`, as they are considered bad practices after the Istanbul hardfork.
        (bool success, ) = to.call{value: amount}("");
        if(!success) {
            revert NativeTransferFailed();
        }
    }
}
