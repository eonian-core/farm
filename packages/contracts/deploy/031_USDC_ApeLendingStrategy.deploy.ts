import { generateApeSwapLendingStrategyDeployment } from '../hardhat/deployments/ApeLendingStrategy.deployment';

/**
 * Deploy USDC ApeSwap Lending strategy contract
 */
export default generateApeSwapLendingStrategyDeployment({
  asset: "USDC",
})