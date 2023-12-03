import { generateVaultDeployment } from '../hardhat/deployments/Vault.deployment'

/**
 * Deploy WETH Vault contract
 */
export default generateVaultDeployment({
  asset: 'WETH',
})
