import type { HardhatRuntimeEnvironment } from 'hardhat/types'
import { ContractGroup, TokenSymbol } from '../types'
import { getProviders } from '../providers/addresses'
import { type ApeLendingStrategy } from '../../typechain-types'
import { type DeployResult, DeployStatus, Deployer } from './helpers/Deployer'

export default async function deployApeLendingStrategy(token: TokenSymbol, hre: HardhatRuntimeEnvironment): Promise<DeployResult> {
  const addresses = await getAddreses(token, hre)

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

  const deployResult = await Deployer.performDeploy('ApeLendingStrategy', token, initializeArguments, hre)

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

async function getAddreses(token: TokenSymbol, hre: HardhatRuntimeEnvironment) {
  const providers = getProviders(hre)
  return {
    asset: await providers[ContractGroup.TOKEN].getAddressForToken(token),
    cToken: await providers[ContractGroup.APESWAP].getAddressForToken(token),
    assetPriceFeed: await providers[ContractGroup.CHAINLINK_FEED].getAddressForToken(token),
    gelato: await providers[ContractGroup.GELATO].getAddress(),
    vault: await providers[ContractGroup.EONIAN_VAULT].getAddressForToken(token),
    nativePriceFeed: await providers[ContractGroup.CHAINLINK_FEED].getAddressForToken(TokenSymbol.BNB),
    healthCheck: await providers[ContractGroup.EONIAN_HEALTH_CHECK].getAddress(),
  }
}
