import type { HardhatRuntimeEnvironment } from 'hardhat/types'
import { TokenSymbol } from '@eonian/upgradeable'
import { type DeployResult, DeployStatus } from '@eonian/upgradeable'
import { type ApeLendingStrategy } from '../../typechain-types'
import { Addresses, forceAttachTransactions } from './addresses'
import { attachToVault } from './helpers/attach-to-vault'
import { getMinReportInterval } from './helpers/get-min-report-interval'
import { setDefaultWorkGas } from './helpers/set-default-work-gas'

const contractName = 'ApeLendingStrategy'

export default async function deployApeLendingStrategy(token: TokenSymbol, hre: HardhatRuntimeEnvironment): Promise<DeployResult> {
  const addresses = await getAddresses(token, hre)

  const initializeArguments: Parameters<ApeLendingStrategy['initialize']> = [
    addresses.vault,
    addresses.asset,
    addresses.cToken, // cToken - lending market
    addresses.gelato, // gelato coordination contract
    addresses.nativePriceFeed, // native token price feed
    addresses.assetPriceFeed, // asset token price feed
    getMinReportInterval(hre, 6 * 60 * 60), // 6 hours - min report interval in seconds
    true, // Job is prepaid
    addresses.healthCheck,
  ]

  const deployResult = await hre.deploy(contractName, token, initializeArguments)

  if (deployResult.status === DeployStatus.DEPLOYED || forceAttachTransactions()) {
    await attachToVault(contractName, deployResult.proxyAddress, token, addresses.vault, hre)
  }

  await setDefaultWorkGas(hre, contractName, deployResult.proxyAddress, token)

  return deployResult
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
