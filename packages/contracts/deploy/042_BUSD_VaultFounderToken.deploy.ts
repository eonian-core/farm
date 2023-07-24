import { generateVaultFounderTokenDeployment } from '../hardhat/deployments/VaultFounderToken.deployment';

/**
 * Deploy BUSD Vault Founder Token contract
 */

export default generateVaultFounderTokenDeployment({
  asset: "BUSD"
})

