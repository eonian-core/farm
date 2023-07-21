import { Address, ethereum } from "@graphprotocol/graph-ts";
import { Price } from "../generated/schema";
import { genId, IPriceService } from "../src/price/price-service";
import { mockViewFunction } from "./mocking";

export class MockPriceSerivce implements IPriceService {
    public createOrUpdate(symbol: string, contractAddress: Address): Price {
        return new Price(genId(symbol, contractAddress));
    }

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

  mockViewFunction(priceFeed, "decimals", "uint8", [
    ethereum.Value.fromI32(8),
  ]);
}
