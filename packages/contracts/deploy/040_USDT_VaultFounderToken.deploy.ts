import {DeployConfig, BaseDeploymentService, BaseInitArgs, wrap} from '@eonian/upgradeable'

import { BlockchainType } from "../hardhat.config";
import { DeployResult, Deployment } from '@eonian/hardhat-deploy/types';

/**
 * Deploy Vault Founder Token contract
 */
export const config: DeployConfig = {
  contract: "VaultFounderToken",
  dependencies: ["Vault|Asset[USDT]"],
  chains: [
    BlockchainType.Mainnet,
    BlockchainType.Testnet,
    BlockchainType.Local,
  ],
  tags: ["Asset[USDT]"],
}

export class VaultFounderTokenDeployment extends BaseDeploymentService {
  async onResolveInitArgs({dependencies: [vault]}: BaseInitArgs): Promise<Array<any>> {
    return [
      100, // maxCountTokens
      12_000, // nextTokenPriceMultiplier
      200, // initialTokenPrice
      "Eonian USDT Vault Founder Token", // name
      "eonUSDT.VFT", // symbol
      vault
    ]
  }

  async afterDeploy(deplyment: DeployResult, [vault]: Array<Deployment>) {
    this.logger.log("Adding Vault to VaultFounderToken");
    const Vault = await this.hre.ethers.getContractAt("Vault", vault.address);
    const VaultFounderToken = await this.hre.ethers.getContractAt("VaultFounderToken", deplyment.address);

    const txVault = await Vault.setFounders(VaultFounderToken.address);
    const resultAddingVaultFounderToken = await txVault.wait();
    this.logger.log("VaultFounderToken added to vault", resultAddingVaultFounderToken);
  }
}

export default wrap(config, VaultFounderTokenDeployment);
