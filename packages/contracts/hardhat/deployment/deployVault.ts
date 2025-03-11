import type { HardhatRuntimeEnvironment } from 'hardhat/types'
import type { DeployResult, TokenSymbol } from '@eonian/upgradeable'
import { NetworkEnvironment, resolveNetworkEnvironment } from '@eonian/upgradeable'
import type { Vault } from '../../typechain-types'
import { Addresses } from './addresses'

function checkIsProduction(hre: HardhatRuntimeEnvironment) {
  const environment = resolveNetworkEnvironment(hre)
  return environment === NetworkEnvironment.PRODUCTION
}

export default async function deployVault(token: TokenSymbol, hre: HardhatRuntimeEnvironment): Promise<DeployResult> {
  const addresses = await getAddreses(token, hre)

  const isProduction = checkIsProduction(hre)
  console.log(`Deploying vault for ${token} in ${isProduction ? 'production' : 'dev'} mode`)

  const initializeArguments: Parameters<Vault['initialize']> = [
    addresses.asset, // Token address
    addresses.treasury, // Address for rewards
    isProduction ? 3000 : 1500, // 30% fee for production versions, 15% for dev.
    10n ** 18n / 3600n, // 6 hours for locked profit release
    isProduction ? `Insured ${token} Vault Shares` : `Eonian ${token} Vault Shares`, // Vault name
    isProduction ? `Insured${token}` : `eon${token}`, // Vault share symbol
    [], // Parameter: "defaultOperators"
    100, // Vault founder tokens fee (1%)
  ]
  return await hre.deploy('Vault', token, initializeArguments)
}

async function getAddreses(token: TokenSymbol, hre: HardhatRuntimeEnvironment) {
  return {
    asset: await hre.addresses.getForToken(Addresses.TOKEN, token),
    treasury: await hre.addresses.get(Addresses.TREASURY),
  }
}
