import { generateVaultFounderTokenDeployment } from '../hardhat/deployments/VaultFounderToken.deployment';

/**
 * Deploy USDT Vault Founder Token contract
 */

export default generateVaultFounderTokenDeployment({
  asset: "USDT"
})

