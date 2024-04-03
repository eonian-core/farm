import { resolveChain, resolveNetworkEnvironment } from '../../types'
import type { LookupMap } from './BaseAddresses'
import { BaseAddresses } from './BaseAddresses'

export class EonianTreasury extends BaseAddresses {
  protected async getLookupMap(): Promise<LookupMap> {
    const chain = resolveChain(this.hre)
    const networkEnvironment = resolveNetworkEnvironment(this.hre)
    const signers = await this.hre.ethers.getSigners()
    return {
      [chain]: {
        [networkEnvironment]: signers.at(0)!.address, // Owner (deployer) address
      },
    }
  }
}
