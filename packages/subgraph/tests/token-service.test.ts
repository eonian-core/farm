import {
  afterAll,
  assert,
  beforeAll,
  beforeEach,
  clearStore,
  describe,
  test,
} from 'matchstick-as/assembly/index'
import { Address, Bytes, ethereum } from '@graphprotocol/graph-ts'
import { TokenService } from '../src/token-service'
import { Context } from '../src/Context'
import { IPriceService } from '../src/price/price-service'
import { MockLogger, mockViewFunction } from './mocking'
import { createUpgradedEvent } from './vault-utils'
import { mockTokenContract } from './mock-token'
import { MockPriceSerivce } from './mock-price'

const tokenAddress = Address.fromString(
  '0xAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
)
const tokenAddressStr = tokenAddress.toHexString()

let implementationAddress: Address
let event: ethereum.Event
let priceService: IPriceService
let service: TokenService

describe('TokenService', () => {
  beforeAll(() => {
    mockTokenContract(tokenAddress)
  })

  beforeEach(() => {
    implementationAddress = Address.fromString(
      '0x0000000000000000000000000000000000000001',
    )
    event = createUpgradedEvent(implementationAddress)
    const ctx = new Context(event, 'test')
    const logger = new MockLogger()
    priceService = new MockPriceSerivce()
    service = new TokenService(ctx, logger, priceService)
  })

  afterAll(() => {
    clearStore()
  })

  describe('getOrCreateToken', () => {
    test('should create Token', () => {
      const token = service.getOrCreateToken(tokenAddress)

      assert.stringEquals(token.name, 'USD Tether')
      assert.stringEquals(token.symbol, 'USDT')
      assert.i32Equals(token.decimals, 18)

      assert.entityCount('Token', 1)

      assert.fieldEquals('Token', tokenAddressStr, 'name', 'USD Tether')
      assert.fieldEquals('Token', tokenAddressStr, 'symbol', 'USDT')
      assert.fieldEquals('Token', tokenAddressStr, 'decimals', '18')

      // Check that price object is correctly linked with its parent.
      assert.fieldEquals('Token', tokenAddressStr, 'price', Bytes.fromUTF8(`USDT-${tokenAddressStr}-price`).toHexString())
    })

    test('should get Token', () => {
      // Mock the contract call for getting the name
      mockViewFunction(tokenAddress, 'name', 'string', [ethereum.Value.fromString('qqq')])
      // Mock the contract call for getting the symbol
      mockViewFunction(tokenAddress, 'symbol', 'string', [ethereum.Value.fromString('eee')])
      // Mock the contract call for getting the decimals
      mockViewFunction(tokenAddress, 'decimals', 'uint8', [ethereum.Value.fromI32(28)])

      const token = service.getOrCreateToken(tokenAddress)

      assert.stringEquals(token.name, 'USD Tether')
      assert.stringEquals(token.symbol, 'USDT')
      assert.i32Equals(token.decimals, 18)

      // Check that price object is correctly linked with its parent.
      assert.fieldEquals('Token', tokenAddressStr, 'price', Bytes.fromUTF8(`USDT-${tokenAddressStr}-price`).toHexString())

      assert.entityCount('Token', 1)

      // shuldnt be updated
      assert.fieldEquals('Token', tokenAddressStr, 'name', 'USD Tether')
      assert.fieldEquals('Token', tokenAddressStr, 'symbol', 'USDT')
      assert.fieldEquals('Token', tokenAddressStr, 'decimals', '18')
    })
  })
})
