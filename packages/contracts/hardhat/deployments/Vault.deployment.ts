import { BigNumber } from 'ethers'
import type { DeployFunction } from 'hardhat-deploy/types'
import type { BaseInitArgs, DeployConfig } from '@eonian/upgradeable'
import { BaseDeploymentService, wrap } from '@eonian/upgradeable'

import { BlockchainType, Stage } from '../../hardhat.config'

export interface VaultDeploymentOptions {
  /** Name of asset */
  asset: string
}

export interface VaultDeployConfig extends DeployConfig {
  options: VaultDeploymentOptions
}

/**
 * Base config for Vault deployment
 */
export const base: Omit<DeployConfig, 'tags'> = {
  contract: 'Vault',
  chains: [BlockchainType.Mainnet, BlockchainType.Testnet, BlockchainType.Local],
}

export function generateVaultDeployment(options: VaultDeploymentOptions): DeployFunction {
  const config: VaultDeployConfig = {
    ...base,
    options,
    tags: [`Asset[${options.asset}]`],
  }

  return wrap(config, VaultDeployment)
}

export class VaultDeployment extends BaseDeploymentService {
  onResolveInitArgs({ accounts, stage }: BaseInitArgs): Promise<Array<any>> {
    const { asset: assetName }: VaultDeploymentOptions = (this.config as VaultDeployConfig).options

    const asset = accounts[assetName]
    if (!asset) {
      throw new Error(`Asset ${assetName} not found in accounts`)
    }

    const { treasury } = accounts

    return Promise.resolve([
      asset, // asset
      treasury, // rewards
      stage !== Stage.Production // managment fee
        ? 1500 // 15% for development and test versions
        : 2000, // 20% for production versions
      BigNumber.from(`1${'0'.repeat(18)}`).div(3600), // 6 hours of locked profit release rate
      `Eonian ${assetName} Vault Shares`, // name
      `eon${assetName}`, // symbol
      [], // defaultOperators
      100, // vault founder tokens fee 1%
    ])
  }
}
