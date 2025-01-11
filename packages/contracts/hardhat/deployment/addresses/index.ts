import type { HardhatRuntimeEnvironment } from 'hardhat/types'
import { extendEnvironment } from 'hardhat/config'
import type { BaseAddresses, TokenSymbol } from '@eonian/upgradeable'
import { ApeSwap } from './ApeSwap'
import { GelatoOps } from './GelatoOps'
import { ERC20 } from './ERC20'
import { EonianVault } from './EonianVault'
import { EonianHealthCheck } from './EonianHealthCheck'
import { EonianTreasury } from './EonianTreasury'
import { Chainlink } from './Chainlink'
import { AaveV3LikePool } from './AaveV3LikePool'

/** Allow to execute attach transactions without deployments */
export const forceAttachTransactions = () => process.env.FORCE_ATTACH_TRANSACTIONS === 'true'

export enum Addresses {
  APESWAP = 'APESWAP',
  CHAINLINK = 'CHAINLINK',
  HEALTH_CHECK = 'HEALTH_CHECK',
  TREASURY = 'TREASURY',
  VAULT = 'VAULT',
  TOKEN = 'TOKEN',
  GELATO = 'GELATO',
  AAVE_V2 = 'AAVE_V2',
  AAVE_V3 = 'AAVE_V3',
}

declare module 'hardhat/types/runtime' {
  export interface HardhatRuntimeEnvironment {
    addresses: {
      get: (addresses: Addresses) => Promise<string>
      getForToken: (addresses: Addresses, token: TokenSymbol) => Promise<string>
      getProvider: (addresses: Addresses) => BaseAddresses
    }
  }
}

extendEnvironment((hre) => {
  const providers = resolveProviders(hre)
  hre.addresses = {
    get: addresses => providers[addresses].getAddress(),
    getForToken: (addresses, token) => providers[addresses].getAddressForToken(token),
    getProvider: addresses => providers[addresses],
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
    [Addresses.AAVE_V2]: new AaveV3LikePool(hre),
    [Addresses.AAVE_V3]: new AaveV3LikePool(hre),
  }
}
