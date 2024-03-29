import { BigInt, Bytes } from '@graphprotocol/graph-ts'
import { RewardAPY } from '../generated/schema'
import { IRewardApyService } from '../src/apy/reward-apy-service'

export class MockRewardApyService implements IRewardApyService {
  public createOrUpdate(id: Bytes, _interestRatePerBlock: BigInt): RewardAPY {
    return new RewardAPY(id)
  }
}
