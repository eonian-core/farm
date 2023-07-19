import { BigNumber } from "ethers";
import {DeployConfig, BaseDeploymentService, BaseInitArgs, wrap} from '@eonian/upgradeable'

import { BlockchainType, Stage } from "../hardhat.config";

/**
 * Deploy USDT Vault contract
 */
export const config: DeployConfig = {
  contract: "Vault",
  chains: [
    BlockchainType.Mainnet,
    BlockchainType.Testnet,
    BlockchainType.Local,
  ],
  tags: ["Asset[USDT]"],
}

export class VaultDeployment extends BaseDeploymentService {

  async onResolveInitArgs({accounts: { USDT, treasury }, stage}: BaseInitArgs): Promise<Array<any>> {
    return [
      USDT, // asset
      treasury, // rewards
      stage !== Stage.Production // managment fee
        ? 1500 // 15% for development and test versions
        : 2000, // 20% for production versions
      BigNumber.from("1" + "0".repeat(18)).div(3600), // 6 hours of locked profit release rate
      "Eonian USDT Vault Shares", // name
      "eonUSDT", // symbol
      [], // defaultOperators
      100, // vault founder tokens fee 1%
    ]
  }
}

export default wrap(config, VaultDeployment);

