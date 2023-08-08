import { Address, Bytes, BigInt, dataSource } from "@graphprotocol/graph-ts";
import { Price } from "../../generated/schema";
import { ILogger, WithLogger } from "../logger";
import { Context } from "../Context";
import { getPriceFeedAddress } from "./price-feeds";
import { ChainLinkPriceFeed } from "../../generated/Vault/ChainLinkPriceFeed";

export interface IPriceService {
  createOrUpdate(symbol: string, tokenContractAddress: Address): Price;
}

class Tuple2<T, U> {
   _0: T;
   _1: U
};

export class PriceService extends WithLogger implements IPriceService {
  constructor(ctx: Context, logger: ILogger) {
    super(ctx, logger);
  }

  /**
   * Creates new price entity if it doesn't exsit, updates it otherwise.
   * */
  createOrUpdate(symbol: string, tokenContractAddress: Address): Price {
    const id = genId(symbol, tokenContractAddress);
    let entity = Price.load(id);
    if (!entity) {
      this.logger.info("Creating new Price entity for {}", [id.toString()]);
      entity = new Price(id);
    }

    this.logger.info("Filling Price entity for {}", [id.toString()]);

    const priceData = this.getPriceData(symbol, tokenContractAddress);
    entity.value = priceData._0;
    entity.decimals = priceData._1;
    
    entity.save();

    return entity;
  }

  getPriceData(symbol: string, tokenContractAddress: Address): Tuple2<BigInt, i32> {
    // Check if the current token instance is an asset rather than a vault
    if (dataSource.address().equals(tokenContractAddress)) {
      return { _0: BigInt.fromI64(0), _1: 0 };
    }

    // Return 0s, if there is no price feed for specific network or symbol
    const priceFeed = this.getChainLinkContract(symbol);
    if (priceFeed === null) {
      return { _0: BigInt.fromI64(0), _1: 0 };
    }

    const data = priceFeed.latestRoundData();
    const decimals = priceFeed.decimals();
    return { _0: data.getAnswer(), _1: decimals };
  }

  getChainLinkContract(symbol: string): ChainLinkPriceFeed | null {
    const network = dataSource.network();
    const address = getPriceFeedAddress(symbol, network);
    if (address === null) {
      return null;
    }
    return ChainLinkPriceFeed.bind(address);
  }
}

export function genId(symbol: string, tokenContractAddress: Address): Bytes {
  return Bytes.fromUTF8(symbol + '-' + tokenContractAddress.toHexString() + "-price");
}
