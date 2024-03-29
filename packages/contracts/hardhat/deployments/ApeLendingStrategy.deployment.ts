import type { BaseInitArgs, DeployConfig } from '@eonian/upgradeable'
import { BaseDeploymentService, wrap } from '@eonian/upgradeable'
import type { DeployFunction, DeployResult, Deployment } from 'hardhat-deploy/types'
import { BlockchainType } from '../../hardhat.config'
import type { Vault } from '../../typechain-types'

const HOUR = 60 * 60 // hour in seconds

export interface ApeSwapLendingStrategyDeploymentOptions {
  /** Name of asset */
  asset: string
}

export interface ApeSwapLendingStrategyDeployConfig extends DeployConfig {
  options: ApeSwapLendingStrategyDeploymentOptions
}

/**
 * Base config for ApeSwap Lending strategy contract
 */
export const base: Omit<DeployConfig, 'tags' | 'dependencies'> = {
  contract: 'ApeLendingStrategy',
  // Not possible to deploy on testnet, have wide range of thrid party protocols-dependencies
  chains: [BlockchainType.Mainnet, BlockchainType.Local],
}

export function generateApeSwapLendingStrategyDeployment(
  options: ApeSwapLendingStrategyDeploymentOptions,
): DeployFunction {
  const config: ApeSwapLendingStrategyDeployConfig = {
    ...base,
    options,
    dependencies: [`Vault|Asset[${options.asset}]`, 'LossRatioHealthCheck|Default'],
    tags: [`Asset[${options.asset}]`],
  }

  return wrap(config, ApeLendingStrategyDeployment)
}

export class ApeLendingStrategyDeployment extends BaseDeploymentService {
  onResolveInitArgs({ accounts, dependencies: [vault, healthCheck] }: BaseInitArgs): Promise<Array<any>> {
    const { asset: assetName }: ApeSwapLendingStrategyDeploymentOptions = (
      this.config as ApeSwapLendingStrategyDeployConfig
    ).options

    const asset = accounts[assetName]
    const cToken = accounts[`apeSwap__c${assetName}`]
    const tokenUsdFeed = accounts[`chainlink__${assetName}_USD_feed`]
    if (!asset || !cToken || !tokenUsdFeed) {
      throw new Error(`Addresses for ${assetName} not found in accounts`)
    }

    const { gelatoOps, chainlink__BNB_USD_feed } = accounts

    return Promise.resolve([
      vault.address,
      asset,
      cToken, // cToken - lending market
      gelatoOps, // gelato coordination contract
      chainlink__BNB_USD_feed, // native token price feed
      tokenUsdFeed, // asset token price feed
      6 * HOUR, // min report interval in seconds
      true, // Job is prepaid
      healthCheck.address, // LossRatioHealthCheck
    ])
  }

  async afterDeploy(Strategy: DeployResult, [vault]: Array<Deployment>) {
    this.logger.log('Adding strategy to vault')
    const Vault = await this.hre.ethers.getContractAt<Vault>('Vault', vault.address)
    const txStrategy = await Vault.addStrategy(Strategy.address, 10000) // 100% allocation
    const strategyResult = await txStrategy.wait()
    this.logger.log('Strategy added to vault', strategyResult)
  }
}
