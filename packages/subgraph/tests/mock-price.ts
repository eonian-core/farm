import { Address, ethereum } from '@graphprotocol/graph-ts'
import { Price } from '../generated/schema'
import { IPriceService, genId } from '../src/price/price-service'
import { mockViewFunction } from './mocking'

export class MockPriceSerivce implements IPriceService {
  public createOrUpdate(symbol: string, contractAddress: Address): Price {
    return new Price(genId(symbol, contractAddress))
  }
}

export function mockPriceFeed(priceFeed: Address): void {
  mockPriceValue(priceFeed, 250000000 as i32) // 2.5 * 1e8
  mockViewFunction(priceFeed, 'decimals', 'uint8', [
    ethereum.Value.fromI32(8),
  ])
}

export function mockPriceValue(priceFeed: Address, value: i32): void {
  mockViewFunction(
    priceFeed,
    'latestRoundData',
    'uint80,int256,uint256,uint256,uint80',
    [
      ethereum.Value.fromI32(0),
      ethereum.Value.fromI32(value),
      ethereum.Value.fromI32(0),
      ethereum.Value.fromI32(0),
      ethereum.Value.fromI32(0),
    ],
  )
}
