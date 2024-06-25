import "hardhat/types/config";

import type { Chain } from './chains/Chain'
import { NetworkEnvironment } from './NetworkEnvironment'

export * from './chains/Chain'
export * from './tokens/TokenSymbol'

export type AvailableHardhatNetwork = 'hardhat' | 'ganache' | `${Lowercase<Exclude<Chain, Chain.UNKNOWN>>}_${string}_${Lowercase<Exclude<NetworkEnvironment, NetworkEnvironment.LOCAL>>}`

declare module 'hardhat/types/config' {
  interface HardhatUserConfig {
    availableNetworks: Partial<{
      [T in AvailableHardhatNetwork]: T extends 'hardhat' ? HardhatNetworkUserConfig : NetworkUserConfig | undefined
    }>
  }
}
