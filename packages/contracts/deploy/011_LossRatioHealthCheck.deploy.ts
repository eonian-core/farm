import type { BaseInitArgs, DeployConfig } from '@eonian/upgradeable'
import { BaseDeploymentService, wrap } from '@eonian/upgradeable'
import { BlockchainType } from '../hardhat.config'

/**
 * Deploy LossRationHealthCheck.
 */
export const config: DeployConfig = {
  contract: 'LossRatioHealthCheck',
  chains: [BlockchainType.Mainnet, BlockchainType.Testnet, BlockchainType.Local],
  tags: ['Default'],
}

export class LossRatioHealthCheckDeployment extends BaseDeploymentService {
  // eslint-disable-next-line no-empty-pattern
  onResolveInitArgs({}: BaseInitArgs): Promise<Array<any>> {
    return Promise.resolve([
      500, // shutdownLossRatio
    ])
  }
}

export default wrap(config, LossRatioHealthCheckDeployment)
