// SPDX-License-Identifier: GPL-3.0-only
pragma solidity ^0.8.0;

import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";
import "@openzeppelin/contracts-upgradeable/utils/math/SafeMathUpgradeable.sol";

library PriceConverter {
    using SafeMathUpgradeable for uint256;

    uint256 constant DEFAULT_DECIMALS = 18;

    /// @notice Calculates the price of the specified number of tokens.
    /// @dev This function allow us to compare the price of the tokens with different decimals.
    /// @param priceFeed The Chainlink's price feed aggregator.
    /// @param amount Number of tokens, the value of which needs to be calculated.
    /// @param decimals Decimals of the specified token.
    /// @return The calculated price of the tokens, denominated by "decimals".
    function convertAmount(
        AggregatorV3Interface priceFeed,
        uint256 amount,
        uint256 decimals
    ) internal view returns (uint256) {
        (, int256 price, , , ) = priceFeed.latestRoundData();
        uint256 priceFeedDecimals = priceFeed.decimals();
        (, uint256 upToDecimals) = uint256(DEFAULT_DECIMALS).trySub(
            priceFeedDecimals
        );
        return (amount * uint256(price) * 10**upToDecimals) / 10**decimals;
    }
}
