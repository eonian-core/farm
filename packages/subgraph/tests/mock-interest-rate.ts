import { Address, BigInt, Bytes } from '@graphprotocol/graph-ts'
import { InterestRate } from '../generated/schema'
import { IInterestRateService } from '../src/interest-rate/interest-rate-service'
import { InterestRateSide, InterestRateType, rateSideToString, rateTypeToString } from '../src/interest-rate/types'

export class MockInterestRateService implements IInterestRateService {
  public createOrUpdate(contractAddress: Address, interestRatePerBlock: BigInt, side: InterestRateSide, type: InterestRateType): InterestRate {
    return new InterestRate(Bytes.fromHexString(`${contractAddress.toHexString()}-${rateSideToString(side)}-${rateTypeToString(type)}-${interestRatePerBlock.toString()}`))
  }
}
