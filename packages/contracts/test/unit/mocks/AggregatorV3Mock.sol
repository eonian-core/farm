// SPDX-License-Identifier: AGPL-3.0-only
pragma solidity >=0.8.0;

import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

contract AggregatorV3Mock is AggregatorV3Interface {
    uint8 private _decimals;
    int256 private _price;

    function setDecimals(uint8 __decimals) external {
        _decimals = __decimals;
    }

    function setPrice(int256 __price) external {
        _price = __price;
    }

    function decimals() external view returns (uint8) {
        return _decimals;
    }

    function description() external pure returns (string memory) {
        return "? / ?";
    }

    function version() external pure returns (uint256) {
        return 4;
    }

    function getRoundData(uint80 _roundId)
        external
        pure
        returns (
            uint80 roundId,
            int256 answer,
            uint256 startedAt,
            uint256 updatedAt,
            uint80 answeredInRound
        )
    {
        return (_roundId, 0, 0, 0, 0);
    }

    function latestRoundData()
        external
        view
        returns (
            uint80 roundId,
            int256 answer,
            uint256 startedAt,
            uint256 updatedAt,
            uint80 answeredInRound
        )
    {
        return (0, _price, 0, 0, 0);
    }
}
