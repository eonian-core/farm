import type { HardhatRuntimeEnvironment } from 'hardhat/types'
import { TokenSymbol } from '@eonian/upgradeable'
import { type DeployResult, DeployStatus } from '@eonian/upgradeable'
import { type AaveSupplyStrategy } from '../../typechain-types'
import { Addresses, forceAttachTransactions } from './addresses'
import { attachToVault } from './helpers/attach-to-vault'
import { getAverageBlockTimeInSeconds } from './helpers/get-average-block-time'

const contractName = 'AaveSupplyStrategy'

export default async function deployAaveSupplyStrategy(
  token: TokenSymbol,
  aaveVersion: 'v2' | 'v3',
  hre: HardhatRuntimeEnvironment,
): Promise<DeployResult> {
  const addresses = await getAddresses(token, aaveVersion, hre)

  const initializeArguments: Parameters<AaveSupplyStrategy['initialize']> = [
    addresses.vault,
    addresses.asset,
    addresses.pool, // cToken - lending market
    addresses.gelato, // gelato coordination contract
    6 * 60 * 60, // 6 hours - min report interval in seconds
    true, // Job is prepaid
    addresses.nativePriceFeed, // native token price feed
    addresses.assetPriceFeed, // asset token price feed
    addresses.healthCheck,
    getAverageBlockTimeInSeconds(hre) * 1000, // Average block time in ms
  ]

  const deployResult = await hre.deploy(contractName, token, initializeArguments)

  if (deployResult.status === DeployStatus.DEPLOYED || forceAttachTransactions()) {
    await attachToVault(contractName, deployResult.proxyAddress, token, addresses.vault, hre)
  }

  return deployResult
}

async function getAddresses(token: TokenSymbol, aaveVersion: 'v2' | 'v3', hre: HardhatRuntimeEnvironment) {
  return {
    asset: await hre.addresses.getForToken(Addresses.TOKEN, token),
    pool: await hre.addresses.getForToken(aaveVersion === 'v3' ? Addresses.AAVE_V3 : Addresses.AAVE_V2, token),
    assetPriceFeed: await hre.addresses.getForToken(Addresses.CHAINLINK, token),
    gelato: await hre.addresses.get(Addresses.GELATO),
    vault: await hre.addresses.getForToken(Addresses.VAULT, token),
    nativePriceFeed: await hre.addresses.getForToken(Addresses.CHAINLINK, TokenSymbol.BNB),
    healthCheck: await hre.addresses.get(Addresses.HEALTH_CHECK),
  }
}
