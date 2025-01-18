import { Chain, DeployResult, resolveChain, TokenSymbol } from '@eonian/upgradeable';
import { HardhatRuntimeEnvironment } from 'hardhat/types';
import deployAaveSupplyStrategy from '../../deployment/deployAaveSupplyStrategy';
import deployApeLendingStrategy from '../../deployment/deployApeLendingStrategy';

export enum Strategy {
  APESWAP = 'ApeLendingStrategy',
  AAVE_V2 = 'AAVE_V2',
  AAVE_V3 = 'AAVE_V3',
}

/**
 * Add here all the new strategies that are planned to be deployed in production.
 */
const strategyDeploymentPlan: Partial<Record<Chain, Partial<Record<Strategy, TokenSymbol[]>>>> = {
  [Chain.BSC]: {
    [Strategy.APESWAP]: [TokenSymbol.USDC, TokenSymbol.USDT, TokenSymbol.BTCB, TokenSymbol.WETH],
  },
};

/**
 * Deployment functions for each strategy.
 */
const deployers: Record<Strategy, (token: TokenSymbol, hre: HardhatRuntimeEnvironment) => Promise<DeployResult>> = {
  [Strategy.AAVE_V3]: (token, hre) => deployAaveSupplyStrategy(token, 3, hre),
  [Strategy.AAVE_V2]: (token, hre) => deployAaveSupplyStrategy(token, 2, hre),
  [Strategy.APESWAP]: deployApeLendingStrategy,
}

export function getStrategyDeployer(strategy: Strategy, token: TokenSymbol) {
  return (hre: HardhatRuntimeEnvironment) => deployers[strategy](token, hre)
}

export function getStrategyDeploymentPlan(hre: HardhatRuntimeEnvironment) {
  const chain = resolveChain(hre);
  const strategies = strategyDeploymentPlan[chain];
  if (!strategies) {
    throw new Error(`No strategies to deploy for "${chain}" chain!`);
  } 
  return strategies
}
