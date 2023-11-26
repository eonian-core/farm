import { generateVaultDeployment } from '../hardhat/deployments/Vault.deployment'

/**
 * Deploy USDC Vault contract
 */
export default generateVaultDeployment({
  asset: 'USDC',
})
