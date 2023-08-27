import type { BaseInitArgs, DeployConfig } from '@eonian/upgradeable'
import { BaseDeploymentService, wrap } from '@eonian/upgradeable'
import { BlockchainType } from '../hardhat.config'

/**
 * Testing deploy of simple Gelato Job, only to test gelato or local fork
 */
export const config: DeployConfig = {
  contract: 'SimpleGelatoJob',
  chains: [BlockchainType.Local],
  tags: ['Test'],
}

export class SimpleGelatoJobDeployment extends BaseDeploymentService {
  onResolveInitArgs({ accounts: { gelatoOps } }: BaseInitArgs): Promise<Array<any>> {
    return Promise.resolve([
      gelatoOps,
      1001, // minimum time between executions in seconds
      true, // is prepayed
    ])
  }
}

export default wrap(config, SimpleGelatoJobDeployment)
