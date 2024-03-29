import {
  afterEach,
  assert,
  beforeEach,
  clearStore,
  dataSourceMock,
  describe,
  test,
} from 'matchstick-as/assembly/index'
import { Address, BigInt, ethereum } from '@graphprotocol/graph-ts'
import { Context } from '../src/Context'
import { PriceService } from '../src/price/price-service'
import { BNB_ADDRESSES } from '../src/price/price-feeds'
import { MockLogger, mockViewFunction } from './mocking'
import { createUpgradedEvent } from './vault-utils'
import { mockTokenContract } from './mock-token'
import { mockPriceFeed, mockPriceValue } from './mock-price'

const tokenAddress = Address.fromString(
  '0xAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
)

let implementationAddress: Address
let event: ethereum.Event
let service: PriceService

describe('TokenService (Price Feed)', () => {
  beforeEach(() => {
    mockTokenContract(tokenAddress)
  })

  beforeEach(() => {
    implementationAddress = Address.fromString(
      '0x0000000000000000000000000000000000000001',
    )
    event = createUpgradedEvent(implementationAddress)
    const ctx = new Context(event, 'test')
    const logger = new MockLogger()
    service = new PriceService(ctx, logger)
  })

  afterEach(() => {
    clearStore()
  })

  test('should create price (BSC)', () => {
    dataSourceMock.setNetwork('bsc')

    BNB_ADDRESSES.entries.forEach((value) => {
      const symbol = value.key
      const address = value.value
      mockPriceFeed(address)

      const price = service.createOrUpdate(symbol, tokenAddress)
      assert.i32Equals(price.decimals, 8)
      assert.bigIntEquals(price.value, BigInt.fromI64(250000000))
    })

    assert.entityCount('Price', BNB_ADDRESSES.entries.length)
  })

  test('should update price (BSC)', () => {
    BNB_ADDRESSES.entries.forEach((value) => {
      const symbol = value.key
      const address = value.value

      mockPriceValue(address, 1234567890)
      mockViewFunction(address, 'decimals', 'uint8', [
        ethereum.Value.fromI32(16),
      ])

      const price = service.createOrUpdate(symbol, tokenAddress)
      assert.i32Equals(price.decimals, 16)
      assert.bigIntEquals(price.value, BigInt.fromI64(1234567890))
    })

    assert.entityCount('Price', BNB_ADDRESSES.entries.length)
  })

  test('should create price (Sepolia)', () => {
    dataSourceMock.setNetwork('sepolia')

    const USDT_PRICE_FEED = Address.fromString(
      '0xA2F78ab2355fe2f984D808B5CeE7FD0A93D5270E',
    )
    mockPriceFeed(USDT_PRICE_FEED)

    const price = service.createOrUpdate('USDT', tokenAddress)
    assert.i32Equals(price.decimals, 8)
    assert.bigIntEquals(price.value, BigInt.fromI64(250000000))
  })

  test('should create price with 0 value if network is not supported', () => {
    dataSourceMock.setNetwork('unknown')

    const USDT_PRICE_FEED = Address.fromString(
      '0xA2F78ab2355fe2f984D808B5CeE7FD0A93D5270E',
    )
    mockPriceFeed(USDT_PRICE_FEED)

    const price = service.createOrUpdate('USDT', tokenAddress)
    assert.i32Equals(price.decimals, 0)
    assert.bigIntEquals(price.value, BigInt.zero())
  })

  test('should create price with 0 value if token is not supported', () => {
    dataSourceMock.setNetwork('bsc')

    const USDT_PRICE_FEED = Address.fromString(
      '0xA2F78ab2355fe2f984D808B5CeE7FD0A93D5270E',
    )
    mockPriceFeed(USDT_PRICE_FEED)

    const price = service.createOrUpdate('UNSUPPORTED_SYMBOL', tokenAddress)
    assert.i32Equals(price.decimals, 0)
    assert.bigIntEquals(price.value, BigInt.zero())
  })

  test('should create price with 0 value if token is a vault share', () => {
    dataSourceMock.setNetwork('bsc')
    dataSourceMock.setAddress(tokenAddress.toHexString())

    const USDT_PRICE_FEED = Address.fromString(
      '0xB97Ad0E74fa7d920791E90258A6E2085088b4320',
    )
    mockPriceFeed(USDT_PRICE_FEED)

    const price = service.createOrUpdate('USDT', tokenAddress)
    assert.i32Equals(price.decimals, 0)
    assert.bigIntEquals(price.value, BigInt.zero())
  })
})
