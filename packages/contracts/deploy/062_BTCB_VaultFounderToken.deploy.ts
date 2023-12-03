import { generateVaultFounderTokenDeployment } from '../hardhat/deployments/VaultFounderToken.deployment'

/**
 * Deploy BTCB Vault Founder Token contract
 */

export default generateVaultFounderTokenDeployment({
  asset: 'BTCB',
})
