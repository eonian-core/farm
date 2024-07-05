import "hardhat/types/config";

import type { Chain } from './chains'
import { NetworkEnvironment } from './environment'

export type AvailableHardhatNetwork = 'hardhat' | 'ganache' | `${Lowercase<Exclude<Chain, Chain.UNKNOWN>>}_${string}_${Lowercase<Exclude<NetworkEnvironment, NetworkEnvironment.LOCAL>>}`

declare module 'hardhat/types/config' {
  interface HardhatUserConfig {
    availableNetworks: Partial<{
      [T in AvailableHardhatNetwork]: T extends 'hardhat' ? HardhatNetworkUserConfig : NetworkUserConfig | undefined
    }>
  }
}
