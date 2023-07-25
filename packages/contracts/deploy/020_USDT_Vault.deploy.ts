import { generateVaultDeployment } from "../hardhat/deployments/Vault.deployment";

/**
 * Deploy USDT Vault contract
 */
export default generateVaultDeployment({
  asset: 'USDT'
})

