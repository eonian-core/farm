import type { HardhatRuntimeEnvironment } from 'hardhat/types'
import type { Vault } from '../../typechain-types'
import type { TokenSymbol } from '../types'
import { ContractGroup, NetworkEnvironment, resolveNetworkEnvironment } from '../types'
import { getProviders } from './providers'
import { type DeployResult } from './plugins/Deployer'

export default async function deployVault(token: TokenSymbol, hre: HardhatRuntimeEnvironment): Promise<DeployResult> {
  const addresses = await getAddreses(token, hre)

  const environment = resolveNetworkEnvironment(hre)
  const initializeArguments: Parameters<Vault['initialize']> = [
    addresses.asset, // Token address
    addresses.treasury, // Address for rewards
    environment === NetworkEnvironment.PRODUCTION ? 2000 : 1500, // 20% fee for production versions, 15% for dev.
    10n ** 18n / 3600n, // 6 hours for locked profit release
    `Eonian ${token} Vault Shares`, // Vault name
    `eon${token}`, // Vault share symbol
    [], // Parameter: "defaultOperators"
    100, // Vault founder tokens fee (1%)
  ]
  return await hre.deploy('Vault', token, initializeArguments)
}

async function getAddreses(token: TokenSymbol, hre: HardhatRuntimeEnvironment) {
  const providers = getProviders(hre)
  return {
    asset: await providers[ContractGroup.TOKEN].getAddressForToken(token),
    treasury: await providers[ContractGroup.EONIAN_TREASURY].getAddress(),
  }
}
