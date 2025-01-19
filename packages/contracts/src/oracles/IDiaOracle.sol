// SPDX-License-Identifier: GNU AGPLv3
pragma solidity ^0.8.26;

interface IDiaOracle {
    /**
     * @notice Returns the current price of the specified pair (e.g. BTC/USD).
     * @return The current asset's price in USD with a fix-comma notation of 8 decimals and UNIX timestamp of the last oracle update.
     */
    function getValue(string memory key) external view returns (uint128, uint128);
}