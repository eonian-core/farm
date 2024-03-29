import type { Chain } from './Chain'
import type { NetworkEnvironment } from './NetworkEnvironment'

export * from './Chain'
export * from './NetworkEnvironment'
export * from './TokenSymbol'
export * from './ContractGroup'

export type AvailableHardhatNetwork = 'hardhat' | 'ganache' | `${Lowercase<Chain>}_${string}_${Lowercase<NetworkEnvironment>}`
