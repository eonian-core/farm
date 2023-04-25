// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "forge-std/Test.sol";
import "forge-std/console.sol";

import "contracts/structures/PriceConverter.sol";

import "./mocks/AggregatorV3Mock.sol";

contract PriceConverterTest is Test {
    using PriceConverter for AggregatorV3Mock;

    AggregatorV3Mock priceFeed;

    function setUp() public {
        priceFeed = new AggregatorV3Mock();
    }

    function testPriceIsTheSameForTokensWithDifferentDecimals() public {
        uint8 priceDecimals = 18;
        priceFeed.setDecimals(priceDecimals);
        priceFeed.setPrice(10**priceDecimals);

        uint256 decimalsA = 18;
        uint256 amountA = 10**decimalsA;

        uint256 decimalsB = 12;
        uint256 amountB = 10**decimalsB;

        uint256 resultA = priceFeed.convertAmount(amountA, decimalsA);
        uint256 resultB = priceFeed.convertAmount(amountB, decimalsB);
        assertEq(resultA, resultB);
        assertEq(resultA, 1e18);
    }

    /// @notice The price of a fraction of a token with a smaller number of decimals must be higher (with the same price of the whole token)
    function testShouldTakeIntoAccountTheTokensDecimals() public {
        uint8 priceDecimals = 18;
        priceFeed.setDecimals(priceDecimals);
        priceFeed.setPrice(10**priceDecimals);

        uint256 decimalsA = 18;
        uint256 amountA = 1;

        uint256 decimalsB = 12;
        uint256 amountB = 1;

        uint256 resultA = priceFeed.convertAmount(amountA, decimalsA);
        uint256 resultB = priceFeed.convertAmount(amountB, decimalsB);
        assertEq(resultA, 1);
        assertEq(resultB, 1e6);
        assertTrue(resultB > resultA);
    }

    function testPriceIsTheSameForTokensWithDifferentDecimalsFuzz(
        uint8 priceDecimals,
        uint8 decimalsA,
        uint8 decimalsB
    ) public {
        vm.assume(priceDecimals <= 18);
        vm.assume(decimalsA <= 18);
        vm.assume(decimalsB <= 18);

        priceFeed.setDecimals(priceDecimals);
        priceFeed.setPrice(10**priceDecimals);

        uint256 amountA = 10**decimalsA;
        uint256 amountB = 10**decimalsB;

        uint256 resultA = priceFeed.convertAmount(amountA, decimalsA);
        uint256 resultB = priceFeed.convertAmount(amountB, decimalsB);
        assertEq(resultA, resultB);
        assertEq(resultA, 1e18);
    }
}
