import { Address, BigInt, ethereum } from "@graphprotocol/graph-ts";
import { mockViewFunction } from "./mocking"

export function mockTokenContract(token: Address): void {
    // Mock the contract call for getting the name
    mockViewFunction(token, "name", "string", [ethereum.Value.fromString("USD Tether")])
    // Mock the contract call for getting the symbol
    mockViewFunction(token, "symbol", "string", [ethereum.Value.fromString("USDT")])
    // Mock the contract call for getting the decimals
    mockViewFunction(token, "decimals", "uint8", [ethereum.Value.fromI32(18)])
}


export function mockPriceFeed(priceFeed: Address): void {
    mockViewFunction(
      priceFeed,
      "latestRoundData",
      "uint80,int256,uint256,uint256,uint80",
      [
        ethereum.Value.fromI32(0),
        ethereum.Value.fromI32(256),
        ethereum.Value.fromI32(0),
        ethereum.Value.fromI32(0),
        ethereum.Value.fromI32(0),
      ]
    );
}