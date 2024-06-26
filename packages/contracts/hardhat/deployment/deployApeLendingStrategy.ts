import type { HardhatRuntimeEnvironment } from 'hardhat/types'
import { TokenSymbol } from '../types'
import { type ApeLendingStrategy } from '../../typechain-types'
import { type DeployResult, DeployStatus } from './plugins/Deployer'
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
  const vault = await hre.ethers.getContractAt('Vault', vaultAddress)
  const tx = await vault.addStrategy(strategyAddress, 10000) // Allocate 100%
  await tx.wait()
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
