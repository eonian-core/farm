// SPDX-License-Identifier: AGPL-3.0-only
pragma solidity >=0.8.0;

import "contracts/strategies/protocols/IPancakeRouter.sol";

contract PancakeRouterMock is IPancakeRouter {
    event SwapExactTokensForTokens(
        uint256 amountIn,
        uint256 amountOutMin,
        address[] path,
        address to,
        uint256 deadline
    );

    bool public swapCalled;

    constructor() {
        swapCalled = false;
    }

    function emitSwapExactTokensForTokens(
        uint256 amountIn,
        uint256 amountOutMin,
        address[] calldata path,
        address to,
        uint256 deadline
    ) public {
        emit SwapExactTokensForTokens(
            amountIn,
            amountOutMin,
            path,
            to,
            deadline
        );
    }

    function swapExactTokensForTokens(
        uint256 amountIn,
        uint256 amountOutMin,
        address[] calldata path,
        address to,
        uint256 deadline
    ) external returns (uint256[] memory amounts) {
        emitSwapExactTokensForTokens(
            amountIn,
            amountOutMin,
            path,
            to,
            deadline
        );
        amounts = new uint256[](1);
        amounts[0] = amountIn;

        swapCalled = true;
    }

    function getAmountsOut(
        uint256 amountIn,
        address[] calldata /* path */
    ) external pure returns (uint256[] memory amounts) {
        amounts = new uint256[](1);
        amounts[0] = amountIn;
    }
}
