import { Chain, DeployResult, resolveChain, TokenSymbol } from '@eonian/upgradeable';
import { HardhatRuntimeEnvironment } from 'hardhat/types';
import deployAaveSupplyStrategy from '../../deployment/deployAaveSupplyStrategy';
import deployApeLendingStrategy from '../../deployment/deployApeLendingStrategy';

export type VaultsDeploymentPlan = TokenSymbol[]

const vaultsDeploymentPlans: Partial<Record<Chain, VaultsDeploymentPlan>> = {
  [Chain.BSC]: [TokenSymbol.USDC, TokenSymbol.USDT, TokenSymbol.BTCB, TokenSymbol.WETH],
  [Chain.CROSSFI_TESTNET]: [TokenSymbol.XFT],
}

export function getVaultsDeploymentPlan(hre: HardhatRuntimeEnvironment): VaultsDeploymentPlan {
  const chain = resolveChain(hre);
  const tokens = vaultsDeploymentPlans[chain];
  if (!tokens) {
    throw new Error(`No vaults to deploy for "${chain}" chain!`);
  } 
  return tokens
}

export enum Strategy {
  APESWAP = 'APESWAP',
  AAVE_V2 = 'AAVE_V2',
  AAVE_V3 = 'AAVE_V3',
}

export type StreategiesDeploymentPlan = Partial<Record<Strategy, TokenSymbol[]>>

/**
 * Add here all the new strategies that are planned to be deployed in production.
 */
const strategyDeploymentPlans: Partial<Record<Chain, StreategiesDeploymentPlan>> = {
  [Chain.BSC]: {
    [Strategy.APESWAP]: [TokenSymbol.USDC, TokenSymbol.USDT, TokenSymbol.BTCB, TokenSymbol.WETH],
  },
  [Chain.CROSSFI_TESTNET]: {
    // intentiannly skipped
  }
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

export function getStrategyDeploymentPlan(hre: HardhatRuntimeEnvironment): StreategiesDeploymentPlan {
  const chain = resolveChain(hre);
  const strategies = strategyDeploymentPlans[chain];
  if (!strategies) {
    throw new Error(`No strategies to deploy for "${chain}" chain!`);
  } 
  return strategies
}
