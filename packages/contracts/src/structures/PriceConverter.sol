// SPDX-License-Identifier: GNU AGPLv3
pragma solidity ^0.8.26;

import {AggregatorV3Interface} from "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";
import {SafeMathUpgradeable} from "@openzeppelin/contracts-upgradeable/utils/math/SafeMathUpgradeable.sol";

error NegativePrice();

library PriceConverter {
    using SafeMathUpgradeable for uint256;

    uint256 public constant UP_TO_DECIMALS = 18;

    /// @notice Calculates the price of the specified number of tokens.
    /// @dev This function converts the specified number of tokens to their price (scaled to 18 decimal places).
    /// @param priceFeed The Chainlink's price feed aggregator.
    /// @param amount Number of tokens, the value of which needs to be calculated.
    /// @param decimals Decimals of the specified token.
    /// @return The calculated price of the tokens.
    function convertAmount(
        AggregatorV3Interface priceFeed,
        uint256 amount,
        uint256 decimals
    ) internal view returns (uint256) {
        (, int256 price, , , ) = priceFeed.latestRoundData();
        if (price < 0) {
            revert NegativePrice();
        }

        // Scaling decimals up to 18 places to increase accuracy.
        // For example, the "USD" price feed has 8 decimal places, so the calculation may result in zeros if a small [amount] is passed.
        uint256 priceDecimals = priceFeed.decimals();
        (, uint256 priceScaledDecimals) = UP_TO_DECIMALS.trySub(priceDecimals);
        uint256 scaledPrice = uint256(price) * 10**priceScaledDecimals;

        return amount * scaledPrice / 10**decimals;
    }
}
