import type { HardhatRuntimeEnvironment } from 'hardhat/types'
import { extendEnvironment } from 'hardhat/config'
import type { TokenSymbol } from '../../types'
import type { BaseAddresses } from './BaseAddresses'
import { ApeSwap } from './ApeSwap'
import { GelatoOps } from './GelatoOps'
import { ERC20 } from './ERC20'
import { EonianVault } from './EonianVault'
import { EonianHealthCheck } from './EonianHealthCheck'
import { EonianTreasury } from './EonianTreasury'
import { Chainlink } from './Chainlink'

export enum Addresses {
  APESWAP = 'APESWAP',
  CHAINLINK = 'CHAINLINK',
  HEALTH_CHECK = 'HEALTH_CHECK',
  TREASURY = 'TREASURY',
  VAULT = 'VAULT',
  TOKEN = 'TOKEN',
  GELATO = 'GELATO',
}

declare module 'hardhat/types/runtime' {
  export interface HardhatRuntimeEnvironment {
    addresses: {
      get: (addresses: Addresses) => Promise<string>
      getForToken: (addresses: Addresses, token: TokenSymbol) => Promise<string>
    }
  }
}

extendEnvironment((hre) => {
  const providers = resolveProviders(hre)
  hre.addresses = {
    get: addresses => providers[addresses].getAddress(),
    getForToken: (addresses, token) => providers[addresses].getAddressForToken(token),
  }
})

function resolveProviders(hre: HardhatRuntimeEnvironment): Record<Addresses, BaseAddresses> {
  return {
    [Addresses.APESWAP]: new ApeSwap(hre),
    [Addresses.CHAINLINK]: new Chainlink(hre),
    [Addresses.GELATO]: new GelatoOps(hre),
    [Addresses.TOKEN]: new ERC20(hre),
    [Addresses.VAULT]: new EonianVault(hre),
    [Addresses.HEALTH_CHECK]: new EonianHealthCheck(hre),
    [Addresses.TREASURY]: new EonianTreasury(hre),
  }
}
