import {DeployConfig, BaseDeploymentService, BaseInitArgs, wrap} from '@eonian/upgradeable'
import { BlockchainType } from "../hardhat.config";
import { DeployResult, Deployment } from '@eonian/hardhat-deploy/types';

const HOUR = 60 * 60; // hour in seconds

/**
 * Deploy USDT ApeSwap Lending strategy contract
 */
export const config: DeployConfig = {
  contract: "ApeLendingStrategy",
  dependencies: ["Vault|Asset[USDT]"],
  // Not possible to deploy on testnet, have wide range of thrid party protocols-dependencies
  chains: [
    BlockchainType.Mainnet,
    BlockchainType.Local,
  ],
  tags: ["Asset[USDT]"],
}

export class ApeLendingStrategyDeployment extends BaseDeploymentService {

  async onResolveInitArgs({
    accounts: {
      apeSwap__cUSDT,
      gelatoOps,
      chainlink__BNB_USD_feed,
      chainlink__USDT_USD_feed,
      USDT,
    },
    dependencies: [vault],
  }: BaseInitArgs): Promise<Array<any>> {
    return [
      vault.address,
      USDT,
      apeSwap__cUSDT, // cToken - lending market
      gelatoOps, // gelato coordination contract
      chainlink__BNB_USD_feed, // native token price feed
      chainlink__USDT_USD_feed, // asset token price feed
      6 * HOUR, // min report interval in seconds
      true, // Job is prepaid
    ]
  }

  async afterDeploy(Strategy: DeployResult, [vault]: Array<Deployment>) {
    this.logger.log("Adding strategy to vault");
    const Vault = await this.hre.ethers.getContractAt("Vault", vault.address);

    const tx = await Vault.addStrategy(Strategy.address, 10000); // 100% allocation
    const result = await tx.wait();
    this.logger.log("Strategy added to vault", result);
  }
}

export default wrap(config, ApeLendingStrategyDeployment);
