import {
  afterAll,
  assert,
  beforeEach,
  clearStore,
  describe,
  test,
} from 'matchstick-as/assembly/index'
import { Address, BigInt, Bytes, ethereum } from '@graphprotocol/graph-ts'
import { Context } from '../src/Context'
import { RewardApyService } from '../src/apy/reward-apy-service'
import { INTEREST_RATE_DECIMALS } from '../src/apy/apy-calculations'
import { createUpgradedEvent } from './vault-utils'
import { MockLogger } from './mocking'

const idStr = '0x0000000000000000000000000000000000000001'
const id = Bytes.fromHexString(idStr)

let implementationAddress: Address
let event: ethereum.Event
let service: RewardApyService

describe('RewardApyService', () => {
  beforeEach(() => {
    implementationAddress = Address.fromString(
      '0x0000000000000000000000000000000000000001',
    )
    event = createUpgradedEvent(implementationAddress)
    const ctx = new Context(event, 'test')
    const logger = new MockLogger()
    service = new RewardApyService(ctx, logger)
  })

  afterAll(() => {
    clearStore()
  })

  describe('createOrUpdate', () => {
    test('should create APY entity', () => {
      const interestRatePerBlock = BigInt.fromI64(123)

      const entity = service.createOrUpdate(id, interestRatePerBlock)

      assert.bytesEquals(entity.id, id)

      assert.entityCount('RewardAPY', 1)

      assert.fieldEquals('RewardAPY', idStr, 'decimals', INTEREST_RATE_DECIMALS.toString())
      assert.fieldEquals('RewardAPY', idStr, 'daily', '353406193')
      assert.fieldEquals('RewardAPY', idStr, 'weekly', '2480639625')
      assert.fieldEquals('RewardAPY', idStr, 'monthly', '10749438375')
      assert.fieldEquals('RewardAPY', idStr, 'yearly', '128993260500')
    })

    test('should update APY entity', () => {
      const interestRatePerBlock = BigInt.fromI64(246)

      const entity = service.createOrUpdate(id, interestRatePerBlock)

      assert.bytesEquals(entity.id, id)

      assert.entityCount('RewardAPY', 1)

      assert.fieldEquals('RewardAPY', idStr, 'decimals', INTEREST_RATE_DECIMALS.toString())
      assert.fieldEquals('RewardAPY', idStr, 'daily', '706812386')
      assert.fieldEquals('RewardAPY', idStr, 'weekly', '4961279250')
      assert.fieldEquals('RewardAPY', idStr, 'monthly', '21498876750')
      assert.fieldEquals('RewardAPY', idStr, 'yearly', '257986521000')
    })
  })
})
