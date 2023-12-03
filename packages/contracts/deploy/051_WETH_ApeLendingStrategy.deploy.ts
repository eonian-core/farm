import { generateApeSwapLendingStrategyDeployment } from '../hardhat/deployments/ApeLendingStrategy.deployment'

/**
 * Deploy WETH ApeSwap Lending strategy contract
 */
export default generateApeSwapLendingStrategyDeployment({
  asset: 'WETH',
})
