import { generateApeSwapLendingStrategyDeployment } from '../hardhat/deployments/ApeLendingStrategy.deployment'

/**
 * Deploy BUSD ApeSwap Lending strategy contract
 */
export default generateApeSwapLendingStrategyDeployment({
  asset: 'BUSD',
})
