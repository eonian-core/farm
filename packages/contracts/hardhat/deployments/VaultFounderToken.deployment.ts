import type { BaseInitArgs, DeployConfig } from '@eonian/upgradeable'
import { BaseDeploymentService, wrap } from '@eonian/upgradeable'

import type { DeployFunction, DeployResult, Deployment } from 'hardhat-deploy/types'
import { BlockchainType } from '../../hardhat.config'
import type { Vault } from '../../typechain-types'

export interface VaultFounderTokenDeploymentOptions {
  /** Name of asset */
  asset: string
}

export interface VaultFounderTokenDeployConfig extends DeployConfig {
  options: VaultFounderTokenDeploymentOptions
}

/**
 * Base config for Vault Founder Token contract
 */
export const base: Omit<DeployConfig, 'tags' | 'dependencies'> = {
  contract: 'VaultFounderToken',
  chains: [BlockchainType.Mainnet, BlockchainType.Testnet, BlockchainType.Local],
}

export function generateVaultFounderTokenDeployment(options: VaultFounderTokenDeploymentOptions): DeployFunction {
  const config: VaultFounderTokenDeployConfig = {
    ...base,
    options,
    dependencies: [`Vault|Asset[${options.asset}]`],
    tags: [`Asset[${options.asset}]`],
  }

  return wrap(config, VaultFounderTokenDeployment)
}

export class VaultFounderTokenDeployment extends BaseDeploymentService {
  onResolveInitArgs({ dependencies: [vault] }: BaseInitArgs): Promise<Array<any>> {
    const { asset: assetName }: VaultFounderTokenDeploymentOptions = (this.config as VaultFounderTokenDeployConfig)
      .options
    if (!assetName) {
      throw new Error('Asset name wasn\'t provided')
    }

    return Promise.resolve([
      100, // maxCountTokens
      12_000, // nextTokenPriceMultiplier
      200, // initialTokenPrice
      `Eonian ${assetName} Vault Founder Token`, // name
      `VFT.eon${assetName}`, // symbol
      vault.address, // vault
    ])
  }

  async afterDeploy(deployment: DeployResult, [vault]: Array<Deployment>) {
    this.logger.log('Adding VaultFounderToken to Vault')
    const Vault = await this.hre.ethers.getContractAt<Vault>('Vault', vault.address)
    const VaultFounderToken = await this.hre.ethers.getContractAt('VaultFounderToken', deployment.address)

    const txVault = await Vault.setFounders(VaultFounderToken.address)
    const resultAddingVaultFounderToken = await txVault.wait()
    this.logger.log('VaultFounderToken added to vault', resultAddingVaultFounderToken)
  }
}
