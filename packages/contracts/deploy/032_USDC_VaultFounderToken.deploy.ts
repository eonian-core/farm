import { generateVaultFounderTokenDeployment } from '../hardhat/deployments/VaultFounderToken.deployment';

/**
 * Deploy USDC Vault Founder Token contract
 */

export default generateVaultFounderTokenDeployment({
  asset: "USDC"
})

