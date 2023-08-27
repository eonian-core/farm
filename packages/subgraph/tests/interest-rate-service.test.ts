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
import { InterestRateService } from '../src/interest-rate/interest-rate-service'
import { InterestRateSide, InterestRateType } from '../src/interest-rate/types'
import { MockLogger } from './mocking'
import { createUpgradedEvent } from './vault-utils'
import { MockRewardApyService } from './mock-reward-apy'

const contractAddress = Address.fromString('0xAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA')
const contractAddressStr = contractAddress.toHexString()

let implementationAddress: Address
let event: ethereum.Event
let service: InterestRateService

describe('InterestRateService', () => {
  beforeEach(() => {
    implementationAddress = Address.fromString(
      '0x0000000000000000000000000000000000000001',
    )
    event = createUpgradedEvent(implementationAddress)
    const ctx = new Context(event, 'test')
    const logger = new MockLogger()
    const apyService = new MockRewardApyService()

    service = new InterestRateService(ctx, logger, apyService)
  })

  afterAll(() => {
    clearStore()
  })

  describe('createOrUpdate', () => {
    test('should create InterestRate', () => {
      const interestRatePerBlock = BigInt.fromI32(123)
      const side = InterestRateSide.Borrower
      const type = InterestRateType.Stable

      const entity = service.createOrUpdate(contractAddress, interestRatePerBlock, side, type)

      const expectedId = `${contractAddressStr}-BORROWER-STABLE`
      assert.bytesEquals(entity.id, Bytes.fromUTF8(expectedId))

      assert.entityCount('InterestRate', 1)

      assert.fieldEquals('InterestRate', entity.id.toHexString(), 'perBlock', '123')
      assert.fieldEquals('InterestRate', entity.id.toHexString(), 'side', 'BORROWER')
      assert.fieldEquals('InterestRate', entity.id.toHexString(), 'type', 'STABLE')
      assert.fieldEquals('InterestRate', entity.id.toHexString(), 'apy', entity.id.toHexString())
    })

    test('should create another InterestRate', () => {
      const interestRatePerBlock = BigInt.fromI32(456)
      const side = InterestRateSide.Lender
      const type = InterestRateType.Variable

      const entity = service.createOrUpdate(contractAddress, interestRatePerBlock, side, type)

      const expectedId = `${contractAddressStr}-LENDER-VARIABLE`
      assert.bytesEquals(entity.id, Bytes.fromUTF8(expectedId))

      assert.entityCount('InterestRate', 2)

      assert.fieldEquals('InterestRate', entity.id.toHexString(), 'perBlock', '456')
      assert.fieldEquals('InterestRate', entity.id.toHexString(), 'side', 'LENDER')
      assert.fieldEquals('InterestRate', entity.id.toHexString(), 'type', 'VARIABLE')
      assert.fieldEquals('InterestRate', entity.id.toHexString(), 'apy', entity.id.toHexString())
    })

    test('should update InterestRate', () => {
      const interestRatePerBlock = BigInt.fromI32(234)
      const side = InterestRateSide.Borrower
      const type = InterestRateType.Stable

      const entity = service.createOrUpdate(contractAddress, interestRatePerBlock, side, type)

      const expectedId = `${contractAddressStr}-BORROWER-STABLE`
      assert.bytesEquals(entity.id, Bytes.fromUTF8(expectedId))

      assert.entityCount('InterestRate', 2)

      assert.fieldEquals('InterestRate', entity.id.toHexString(), 'perBlock', '234')
      assert.fieldEquals('InterestRate', entity.id.toHexString(), 'side', 'BORROWER')
      assert.fieldEquals('InterestRate', entity.id.toHexString(), 'type', 'STABLE')
      assert.fieldEquals('InterestRate', entity.id.toHexString(), 'apy', entity.id.toHexString())
    })
  })
})
