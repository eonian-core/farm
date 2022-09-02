// SPDX-License-Identifier: GPL-3.0-only
pragma solidity ^0.8.0;

import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";
import "@openzeppelin/contracts-upgradeable/utils/math/SafeMathUpgradeable.sol";

library PriceConverter {
    using SafeMathUpgradeable for uint256;

    function convertAmount(
        AggregatorV3Interface priceFeed,
        uint256 amount,
        uint256 decimals
    ) internal view returns (uint256) {
        (, int256 price, , , ) = priceFeed.latestRoundData();
        uint256 priceFeedDecimals = priceFeed.decimals();
        (, uint256 upToDecimals) = decimals.trySub(priceFeedDecimals);
        return (amount * uint256(price) * 10**upToDecimals) / 10**decimals;
    }
}
