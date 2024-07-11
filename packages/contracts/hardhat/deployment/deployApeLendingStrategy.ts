import type { HardhatRuntimeEnvironment } from 'hardhat/types'
import { TokenSymbol, sendTxWithRetry } from '@eonian/upgradeable'
import { type ApeLendingStrategy } from '../../typechain-types'
import { type DeployResult, DeployStatus } from '@eonian/upgradeable'
import { Addresses } from './addresses'

export default async function deployApeLendingStrategy(token: TokenSymbol, hre: HardhatRuntimeEnvironment): Promise<DeployResult> {
  const addresses = await getAddresses(token, hre)

  const initializeArguments: Parameters<ApeLendingStrategy['initialize']> = [
    addresses.vault,
    addresses.asset,
    addresses.cToken, // cToken - lending market
    addresses.gelato, // gelato coordination contract
    addresses.nativePriceFeed, // native token price feed
    addresses.assetPriceFeed, // asset token price feed
    6 * 60 * 60, // 6 hours - min report interval in seconds
    true, // Job is prepaid
    addresses.healthCheck,
  ]

  const deployResult = await hre.deploy('ApeLendingStrategy', token, initializeArguments)

  if (deployResult.status === DeployStatus.DEPLOYED) {
    await attachToVault(deployResult.proxyAddress, addresses.vault, hre)
  }

  return deployResult
}

async function attachToVault(strategyAddress: string, vaultAddress: string, hre: HardhatRuntimeEnvironment) {
  console.log(`Attaching strategy to vault:\nStrategy:${strategyAddress}\nVault:${vaultAddress}`)

  const vault = await hre.ethers.getContractAt('Vault', vaultAddress)
  await sendTxWithRetry(() => vault.addStrategy(strategyAddress, 10000)) // Allocate 100%

  console.log(`Strategy attached successfully:\nStrategy:${strategyAddress}\nVault:${vaultAddress}`)
}

async function getAddresses(token: TokenSymbol, hre: HardhatRuntimeEnvironment) {
  return {
    asset: await hre.addresses.getForToken(Addresses.TOKEN, token),
    cToken: await hre.addresses.getForToken(Addresses.APESWAP, token),
    assetPriceFeed: await hre.addresses.getForToken(Addresses.CHAINLINK, token),
    gelato: await hre.addresses.get(Addresses.GELATO),
    vault: await hre.addresses.getForToken(Addresses.VAULT, token),
    nativePriceFeed: await hre.addresses.getForToken(Addresses.CHAINLINK, TokenSymbol.BNB),
    healthCheck: await hre.addresses.get(Addresses.HEALTH_CHECK),
  }
}
