import { resolveChain, resolveNetworkEnvironment } from '../../types'
import type { LookupMap } from './BaseAddresses'
import { BaseAddresses } from './BaseAddresses'

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
