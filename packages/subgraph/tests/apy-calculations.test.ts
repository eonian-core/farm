import { BigInt } from '@graphprotocol/graph-ts'
import {
  assert,
  describe,
  test,
} from 'matchstick-as/assembly/index'
import { toAPY } from '../src/apy/apy-calculations'

describe('toAPY function', () => {
  test('should return the expected APY for a given interest rate and blocks amount', () => {
    const interestRatePerBlock = BigInt.fromI64(33341905821)
    const expectedApy = BigInt.fromString('41835136983765664000')

    const result = toAPY(interestRatePerBlock, 18)

    assert.bigIntEquals(result, expectedApy)
  })
})
