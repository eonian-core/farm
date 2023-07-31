import { DeployConfig, BaseDeploymentService, BaseInitArgs, wrap } from '@eonian/upgradeable'
import { BlockchainType } from "../../hardhat.config";
import { DeployFunction, DeployResult, Deployment } from '@eonian/hardhat-deploy/types';

const HOUR = 60 * 60; // hour in seconds

export interface ApeSwapLendingStrategyDeploymentOptions {
    /** Name of asset */
    asset: string;
}

export interface ApeSwapLendingStrategyDeployConfig extends DeployConfig {
    options: ApeSwapLendingStrategyDeploymentOptions;
}

/**
 * Base config for ApeSwap Lending strategy contract
 */
export const base: Omit<DeployConfig, 'tags' | 'dependencies'> = {
    contract: "ApeLendingStrategy",
    // Not possible to deploy on testnet, have wide range of thrid party protocols-dependencies
    chains: [
        BlockchainType.Mainnet,
        BlockchainType.Local,
    ],
}

export function generateApeSwapLendingStrategyDeployment(options: ApeSwapLendingStrategyDeploymentOptions): DeployFunction {
    const config: ApeSwapLendingStrategyDeployConfig = {
        ...base,
        options,
        dependencies: [`Vault|Asset[${options.asset}]`, `LossRatioHealthCheck|Default`],
        tags: [`Asset[${options.asset}]`],
    }

    return wrap(config, ApeLendingStrategyDeployment);
}


export class ApeLendingStrategyDeployment extends BaseDeploymentService {

    async onResolveInitArgs({
        accounts,
        dependencies: [vault],
    }: BaseInitArgs): Promise<Array<any>> {
        const { asset: assetName }: ApeSwapLendingStrategyDeploymentOptions = (this.config as ApeSwapLendingStrategyDeployConfig).options;

        const asset = accounts[assetName];
        const cToken = accounts[`apeSwap__c${assetName}`];
        const tokenUsdFeed = accounts[`chainlink__${assetName}_USD_feed`];
        if (!asset || !cToken || !tokenUsdFeed) {
            throw new Error(`Addresses for ${assetName} not found in accounts`)
        }

        const {
            gelatoOps,
            chainlink__BNB_USD_feed
        } = accounts;

        return [
            vault.address,
            asset,
            cToken, // cToken - lending market
            gelatoOps, // gelato coordination contract
            chainlink__BNB_USD_feed, // native token price feed
            tokenUsdFeed, // asset token price feed
            6 * HOUR, // min report interval in seconds
            true, // Job is prepaid
        ]
    }

    async afterDeploy(Strategy: DeployResult, [vault, healthCheck]: Array<Deployment>) {
        this.logger.log("Adding strategy to vault");
        const Vault = await this.hre.ethers.getContractAt("Vault", vault.address);
        const HealthCheck = await this.hre.ethers.getContractAt("LossRatioHealthCheck", healthCheck.address);
        const ApeLendingStrategy = await this.hre.ethers.getContractAt("ApeLendingStrategy", Strategy.address);

        const txStrategy = await Vault.addStrategy(Strategy.address, 10000); // 100% allocation
        const strategyResult = await txStrategy.wait();
        this.logger.log("Strategy added to vault", strategyResult);

        const txHealthCheck = await ApeLendingStrategy.setHealthCheck(HealthCheck.address);
        const healthCheckResult = await txHealthCheck.wait();
        this.logger.log("HealthCheck added to ApeLendingStrategy", healthCheckResult);
    }
}
