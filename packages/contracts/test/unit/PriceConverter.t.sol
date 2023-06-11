// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.19;

import "forge-std/Test.sol";
import "forge-std/console.sol";

import {PriceConverter, NegativePrice} from "contracts/structures/PriceConverter.sol";

import "./mocks/AggregatorV3Mock.sol";

contract PriceConverterTest is Test {
    using PriceConverter for AggregatorV3Mock;

    AggregatorV3Mock priceFeed;

    function setUp() public {
        priceFeed = new AggregatorV3Mock();
    }

    function testShouldConvertPrice(uint8 priceDecimals) public {
        vm.assume(priceDecimals >= 4);
        vm.assume(priceDecimals <= 18);

        priceFeed.setDecimals(priceDecimals);
        priceFeed.setPrice(int256(5 * 10 ** (priceDecimals - 1))); // 0.5 USD

        uint256 decimals = 18;
        uint256 amount = 1;
        uint256 result = priceFeed.convertAmount(amount, decimals);
        assertEq(result, 0);

        decimals = 18;
        amount = 10;
        result = priceFeed.convertAmount(amount, decimals);
        assertEq(result, 5);

        decimals = 18;
        amount = 10 ** decimals;
        result = priceFeed.convertAmount(amount, decimals);
        assertEq(result, 5 * 10 ** 17); // 0.5 USD, decimals were scaled up (from 8 to 18)
    }

    function testShouldConvertPriceIfPriceDecimalsBiggerThan18(
        uint8 priceDecimals
    ) public {
        vm.assume(priceDecimals >= PriceConverter.UP_TO_DECIMALS);
        vm.assume(priceDecimals <= PriceConverter.UP_TO_DECIMALS * 2);

        priceFeed.setDecimals(priceDecimals);
        priceFeed.setPrice(int256(5 * 10 ** (priceDecimals - 1))); // 0.5 USD

        uint256 decimals = 18;
        uint256 amount = 1;
        uint256 result = priceFeed.convertAmount(amount, decimals);
        assertEq(
            result,
            priceDecimals <= decimals
                ? 0
                : 5 * 10 ** (priceDecimals - decimals - 1)
        );

        decimals = 18;
        amount = 10 ** decimals;
        result = priceFeed.convertAmount(amount, decimals);
        assertEq(result, 5 * 10 ** (priceDecimals - 1)); // 0.5 USD, decimals were scaled up (from 8 to 18)
    }

    function testAcceptOnlyPositivePriceNumber(
        uint256 amount,
        uint8 decimals
    ) public {
        vm.assume(decimals <= 18);

        uint8 priceDecimals = 8;
        priceFeed.setDecimals(priceDecimals);
        priceFeed.setPrice(-50000000); // 0.5 USD

        // We need this try/catch hack, since "expectRevert" does not work with library calls
        bool failed = false;
        // solhint-disable-next-line no-empty-blocks
        try this.externalWrapperForConvert(amount, decimals) returns (
            uint256
        ) {} catch (bytes memory reason) {
            failed = true;
            bytes4 desiredSelector = bytes4(
                keccak256(bytes("NegativePrice()"))
            );
            bytes4 receivedSelector = bytes4(reason);
            assertEq(desiredSelector, receivedSelector);
        }
        assertEq(failed, true);
    }

    function externalWrapperForConvert(
        uint256 amount,
        uint8 decimals
    ) external view returns (uint256) {
        return priceFeed.convertAmount(amount, decimals);
    }

    function testPriceIsTheSameForTokensWithDifferentDecimals() public {
        uint8 priceDecimals = 18;
        priceFeed.setDecimals(priceDecimals);
        priceFeed.setPrice(int256(10 ** priceDecimals));

        uint256 decimalsA = 18;
        uint256 amountA = 10 ** decimalsA;

        uint256 decimalsB = 12;
        uint256 amountB = 10 ** decimalsB;

        uint256 resultA = priceFeed.convertAmount(amountA, decimalsA);
        uint256 resultB = priceFeed.convertAmount(amountB, decimalsB);
        assertEq(resultA, resultB);
        assertEq(resultA, 1e18);
    }

    /// @notice The price of a fraction of a token with a smaller number of decimals must be higher (with the same price of the whole token)
    function testShouldTakeIntoAccountTheTokensDecimals() public {
        uint8 priceDecimals = 18;
        priceFeed.setDecimals(priceDecimals);
        priceFeed.setPrice(int256(10 ** priceDecimals));

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
        priceFeed.setPrice(int256(10 ** priceDecimals));

        uint256 amountA = 10 ** decimalsA;
        uint256 amountB = 10 ** decimalsB;

        uint256 resultA = priceFeed.convertAmount(amountA, decimalsA);
        uint256 resultB = priceFeed.convertAmount(amountB, decimalsB);
        assertEq(resultA, resultB);
        assertEq(resultA, 1e18);
    }
}
