// SPDX-License-Identifier: GNU AGPLv3
pragma solidity ^0.8.26;

import {AggregatorV3Interface} from "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";
import {IDiaOracle} from "./IDiaOracle.sol";

/**
 * This adapter makes DIA Oracle compatible with Chainlink's aggregator interface.
 */
contract DiaOracleAdapter is AggregatorV3Interface {
  IDiaOracle public immutable DIA_ORACLE;

  string public pair;

  constructor(address _diaOracle, string memory _pair) {
    DIA_ORACLE = IDiaOracle(_diaOracle);
    pair = string(_pair);
  }

  function latestRoundData()
    public
    view
    returns (uint80 roundId, int256 answer, uint256 startedAt, uint256 updatedAt, uint80 answeredInRound)
  {
    (uint128 diaAnswer, uint128 diaUpdatedAt) = DIA_ORACLE.getValue(pair);
    return (0, int256(uint256(diaAnswer)), 0, uint256(diaUpdatedAt), 0);
  }

  function decimals() public pure returns (uint8) {
    return 8;
  }

  function description() external view returns (string memory) {
    return string.concat("DiaOracleAdapter: ", pair);
  }

  function version() external pure returns (uint256) {
    return 0;
  }

  function getRoundData(uint80) public view returns (uint80, int256, uint256, uint256, uint80) {
    return latestRoundData();
  }
}
