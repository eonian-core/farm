import { LossRatioHealthCheck__factory } from '../../../typechain-types'
import { DeploymentData } from '../../deployment/helpers/DeploymentData'
import { ContractGroup, resolveChain, resolveNetworkEnvironment } from '../../types'
import type { LookupMap } from './BaseProvider'
import { BaseProvider } from './BaseProvider'

export class EonianHealthCheckProvider extends BaseProvider {
  protected async getLookupMap(): Promise<LookupMap> {
    const deploymentData = new DeploymentData(this.hre)
    const chain = resolveChain(this.hre)
    const networkEnvironment = resolveNetworkEnvironment(this.hre)
    return {
      [chain]: {
        [networkEnvironment]: await deploymentData.getProxyAddress(LossRatioHealthCheck__factory.contractName, null),
      },
    }
  }

  protected get name(): string {
    return ContractGroup.CHAINLINK_FEED
  }
}
