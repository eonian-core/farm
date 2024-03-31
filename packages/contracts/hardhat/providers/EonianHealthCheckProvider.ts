import { resolveChain, resolveNetworkEnvironment } from '../types'
import type { LookupMap } from './BaseProvider'
import { BaseProvider } from './BaseProvider'

export class EonianHealthCheckProvider extends BaseProvider {
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
