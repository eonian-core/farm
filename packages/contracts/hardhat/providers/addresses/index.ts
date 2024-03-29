import type { HardhatRuntimeEnvironment } from 'hardhat/types'
import { ContractGroup } from '../../types'
import type { BaseProvider } from './BaseProvider'
import { ApeSwapProvider } from './ApeSwapProvider'
import { ChainLinkProvider } from './ChainLinkProvider'
import { GelatoProvider } from './GelatoProvider'
import { TokenProvider } from './TokenProvider'
import { EonianVaultProvider } from './EonianVaultProvider'
import { EonianHealthCheckProvider } from './EonianHealthCheckProvider'
import { EonianTreasuryProvider } from './EonianTreasuryProvider'

let _cache: Record<ContractGroup, BaseProvider> | null = null

export function getProviders(hre: HardhatRuntimeEnvironment): Record<ContractGroup, BaseProvider> {
  return _cache ??= {
    [ContractGroup.APESWAP]: new ApeSwapProvider(hre),
    [ContractGroup.CHAINLINK_FEED]: new ChainLinkProvider(hre),
    [ContractGroup.GELATO]: new GelatoProvider(hre),
    [ContractGroup.TOKEN]: new TokenProvider(hre),
    [ContractGroup.EONIAN_VAULT]: new EonianVaultProvider(hre),
    [ContractGroup.EONIAN_HEALTH_CHECK]: new EonianHealthCheckProvider(hre),
    [ContractGroup.EONIAN_TREASURY]: new EonianTreasuryProvider(hre),
  } satisfies Record<ContractGroup, BaseProvider>
}
