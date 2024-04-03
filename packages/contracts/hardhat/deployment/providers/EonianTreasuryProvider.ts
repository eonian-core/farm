import { resolveChain, resolveNetworkEnvironment } from '../../types'
import type { LookupMap } from './BaseProvider'
import { BaseProvider } from './BaseProvider'

export class EonianTreasuryProvider extends BaseProvider {
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
