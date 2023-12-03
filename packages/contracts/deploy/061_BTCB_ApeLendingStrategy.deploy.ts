import { generateApeSwapLendingStrategyDeployment } from '../hardhat/deployments/ApeLendingStrategy.deployment'

/**
 * Deploy BTCB ApeSwap Lending strategy contract
 */
export default generateApeSwapLendingStrategyDeployment({
  asset: 'BTCB',
})
