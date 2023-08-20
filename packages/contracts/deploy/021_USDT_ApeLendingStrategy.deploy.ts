import { generateApeSwapLendingStrategyDeployment } from '../hardhat/deployments/ApeLendingStrategy.deployment';

/**
 * Deploy USDT ApeSwap Lending strategy contract
 */
export default generateApeSwapLendingStrategyDeployment({
  asset: 'USDT',
});
