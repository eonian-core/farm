// SPDX-License-Identifier: AGPL-3.0-or-later
pragma solidity ^0.8.19;

/// @notice Interface for Uniswap-like exchange router.
interface IPancakeRouter {
    function swapExactTokensForTokens(
        uint256 amountIn,
        uint256 amountOutMin,
        address[] calldata path,
        address to,
        uint256 deadline
    ) external returns (uint256[] memory amounts);

    function getAmountsOut(uint256 amountIn, address[] calldata path)
        external
        view
        returns (uint256[] memory amounts);
}
