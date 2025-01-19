import { BaseAddresses, resolveChain, resolveNetworkEnvironment } from '@eonian/upgradeable'
import type { LookupMap } from '@eonian/upgradeable'

export class EonianHealthCheck extends BaseAddresses {
  protected async getLookupMap(): Promise<LookupMap> {
    const chain = resolveChain(this.hre)
    const networkEnvironment = resolveNetworkEnvironment(this.hre)
    return {
      [chain]: {
        [networkEnvironment]: await this.hre.proxyRegister.getProxyAddress('LossRatioHealthCheck', null),
      },
    }
  }
}
