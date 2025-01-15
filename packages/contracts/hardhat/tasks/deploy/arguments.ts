import type { DeployResult } from '@eonian/upgradeable'
import { TokenSymbol, parseList } from '@eonian/upgradeable'
import type { HardhatRuntimeEnvironment } from 'hardhat/types'
import deployAaveSupplyStrategy from '../../deployment/deployAaveSupplyStrategy'
import deployApeLendingStrategy from '../../deployment/deployApeLendingStrategy'
import { Addresses } from '../../deployment'

type StrategyDeployer = (token: TokenSymbol, hre: HardhatRuntimeEnvironment) => Promise<DeployResult>

const strategyDeployers: Partial<Record<Addresses, StrategyDeployer>> = {
  [Addresses.AAVE_V3]: (token, hre) => deployAaveSupplyStrategy(token, 3, hre),
  [Addresses.AAVE_V2]: (token, hre) => deployAaveSupplyStrategy(token, 2, hre),
  [Addresses.APESWAP]: deployApeLendingStrategy,
}

const deploymentDefaults = {
  tokens: [TokenSymbol.USDC, TokenSymbol.USDT, TokenSymbol.BTCB, TokenSymbol.WETH],
  strategies: [Addresses.APESWAP, Addresses.AAVE_V3],
}

export interface DeployArguments { tokens: TokenSymbol[]; strategies: Addresses[] }

/**
 * Parses the arguments that have been passed to the deployment task
 */
export function parseArguments(args: unknown): DeployArguments {
  const tokens = parseList<TokenSymbol>(args, 'tokens') ?? deploymentDefaults.tokens
  const strategies = parseList<Addresses>(args, 'strategies') ?? deploymentDefaults.strategies
  return { tokens, strategies }
}

export type StrategyDeployData = Partial<Record<Addresses, { deployer: StrategyDeployer; tokens: TokenSymbol[] }>>

/**
 * Returns the deployment functions for compatible “strategy <-> token” pairs.
 */
export async function resolveStrategies(args: DeployArguments, hre: HardhatRuntimeEnvironment): Promise<StrategyDeployData> {
  const result: StrategyDeployData = {}

  for (const strategy of args.strategies) {
    const addressesProvider = hre.addresses.getProvider(strategy)
    const deployer = strategyDeployers[strategy]
    if (!deployer) {
      throw new Error(`No deployment function found for ${strategy}!`)
    }
    const compatibleTokens = await addressesProvider.checkCompatibilityForTokens(args.tokens)
    if (compatibleTokens.length === 0) {
      continue
    }
    result[strategy] = { deployer, tokens: compatibleTokens }
  }
  return result
}
