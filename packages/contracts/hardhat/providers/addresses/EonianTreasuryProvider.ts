import { ZeroAddress } from 'ethers'
import { ContractGroup, resolveChain, resolveNetworkEnvironment } from '../../types'
import type { LookupMap } from './BaseProvider'
import { BaseProvider } from './BaseProvider'

export class EonianTreasuryProvider extends BaseProvider {
  protected getLookupMap(): LookupMap {
    const chain = resolveChain(this.hre)
    const networkEnvironment = resolveNetworkEnvironment(this.hre)
    return {
      [chain]: {
        [networkEnvironment]: ZeroAddress,
      },
    }
  }

  protected get name(): string {
    return ContractGroup.CHAINLINK_FEED
  }
}
