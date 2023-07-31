import { generateVaultDeployment } from "../hardhat/deployments/Vault.deployment";

/**
 * Deploy BUSD Vault contract
 */
export default generateVaultDeployment({
  asset: 'BUSD'
})

