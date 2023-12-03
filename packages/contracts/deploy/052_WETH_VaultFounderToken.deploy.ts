import { generateVaultFounderTokenDeployment } from '../hardhat/deployments/VaultFounderToken.deployment'

/**
 * Deploy WETH Vault Founder Token contract
 */

export default generateVaultFounderTokenDeployment({
  asset: 'WETH',
})
