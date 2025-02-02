import { Chain, DeployResult, resolveChain, TokenSymbol } from '@eonian/upgradeable';
import { HardhatRuntimeEnvironment } from 'hardhat/types';
import deployAaveSupplyStrategy from '../../deployment/deployAaveSupplyStrategy';
import deployApeLendingStrategy from '../../deployment/deployApeLendingStrategy';

export type VaultsDeploymentPlan = TokenSymbol[]

const vaultsDeploymentPlans: Partial<Record<Chain, VaultsDeploymentPlan>> = {
  [Chain.BSC]: [TokenSymbol.USDC, TokenSymbol.USDT, TokenSymbol.BTCB, TokenSymbol.WETH],
  [Chain.CROSSFI_TESTNET]: [TokenSymbol.USDT],
  [Chain.CROSSFI]: [TokenSymbol.WXFI],
}

export const getVaultsDeploymentPlan = (hre: HardhatRuntimeEnvironment): VaultsDeploymentPlan => 
  resolvePlan(hre, vaultsDeploymentPlans);

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
  },
  [Chain.CROSSFI]: {
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

export const getStrategyDeploymentPlan = (hre: HardhatRuntimeEnvironment): StreategiesDeploymentPlan =>
  resolvePlan(hre, strategyDeploymentPlans);

export function resolvePlan<T>(hre: HardhatRuntimeEnvironment, plans: Partial<Record<Chain, T>>): T {
  const chain = resolveChain(hre);
  const plan = plans[chain];
  if (!plan) {
    throw new Error(`Deploy plan for "${chain}" chain not found!`);
  } 

  return plan
}