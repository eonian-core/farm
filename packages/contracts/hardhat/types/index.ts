import type { Chain } from './Chain'
import type { NetworkEnvironment } from './NetworkEnvironment'

export * from './Chain'
export * from './NetworkEnvironment'
export * from './TokenSymbol'
export * from './ContractGroup'

export type AvailableHardhatNetwork = 'hardhat' | 'ganache' | `${Lowercase<Exclude<Chain, Chain.UNKNOWN>>}_${string}_${Lowercase<Exclude<NetworkEnvironment, NetworkEnvironment.LOCAL>>}`

declare module 'hardhat/types/config' {
  interface HardhatUserConfig {
    typedNetworks: Partial<{
      [T in AvailableHardhatNetwork]: T extends 'hardhat' ? HardhatNetworkUserConfig : NetworkUserConfig | undefined
    }>
  }
}
