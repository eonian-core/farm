import { generateVaultDeployment } from '../hardhat/deployments/Vault.deployment'

/**
 * Deploy BTCB Vault contract
 */
export default generateVaultDeployment({
  asset: 'BTCB',
})
