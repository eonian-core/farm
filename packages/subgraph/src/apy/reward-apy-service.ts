import { BigInt, Bytes } from '@graphprotocol/graph-ts'
import { RewardAPY } from '../../generated/schema'
import { WithLogger } from '../logger'
import { INTEREST_RATE_DECIMALS, toAPY } from './apy-calculations'

export interface IRewardApyService {
  createOrUpdate(id: Bytes, interestRatePerBlock: BigInt): RewardAPY
}

export class RewardApyService extends WithLogger implements IRewardApyService {
  /**
     * Creates new interest rate entity if it not exsits
     * or update it in another case
     */
  public createOrUpdate(id: Bytes, interestRatePerBlock: BigInt): RewardAPY {
    let entity = RewardAPY.load(id)
    if (!entity) {
      this.logger.info('Creating new APY entity for {}', [id.toString()])
      entity = new RewardAPY(id)
      entity.decimals = INTEREST_RATE_DECIMALS
    }

    this.logger.info('Filling APY entity for {}', [id.toString()])

    const apy = toAPY(interestRatePerBlock, entity.decimals)
    entity.daily = apy.div(BigInt.fromI64(365))
    entity.weekly = apy.div(BigInt.fromI64(52))
    entity.monthly = apy.div(BigInt.fromI64(12))
    entity.yearly = apy

    entity.save()

    return entity
  }
}
