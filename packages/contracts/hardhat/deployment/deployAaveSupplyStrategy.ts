import type { HardhatRuntimeEnvironment } from 'hardhat/types'
import { TokenSymbol } from '@eonian/upgradeable'
import { type DeployResult, DeployStatus } from '@eonian/upgradeable'
import { type AaveSupplyStrategy } from '../../typechain-types'
import { Addresses, forceAttachTransactions } from './addresses'
import { attachToVault } from './helpers/attach-to-vault'
import { getAverageBlockTimeInSeconds } from './helpers/get-average-block-time'
import { getMinReportInterval } from './helpers/get-min-report-interval'
import { setDefaultWorkGas } from './helpers/set-default-work-gas'

const contractName = 'AaveSupplyStrategy'

export default async function deployAaveSupplyStrategy(
  token: TokenSymbol,
  aaveVersion: 2 | 3,
  hre: HardhatRuntimeEnvironment,
): Promise<DeployResult> {
  const addresses = await getAddresses(token, aaveVersion, hre)

  const initializeArguments: Parameters<AaveSupplyStrategy['initialize']> = [
    addresses.vault,
    addresses.asset,
    addresses.pool, // cToken - lending market
    addresses.gelato, // gelato coordination contract
    getMinReportInterval(hre, 6 * 60 * 60), // 6 hours - min report interval in seconds
    true, // Job is prepaid
    addresses.nativePriceFeed, // native token price feed
    addresses.assetPriceFeed, // asset token price feed
    addresses.healthCheck,
    getAverageBlockTimeInSeconds(hre) * 1000, // Average block time in ms,
    aaveVersion,
  ]

  const deployResult = await hre.deploy(contractName, token, initializeArguments)

  if (deployResult.status === DeployStatus.DEPLOYED || forceAttachTransactions()) {
    await attachToVault(contractName, deployResult.proxyAddress, token, addresses.vault, hre)
  }

  await setDefaultWorkGas(hre, contractName, deployResult.proxyAddress, token)

  return deployResult
}

async function getAddresses(token: TokenSymbol, aaveVersion: 2 | 3, hre: HardhatRuntimeEnvironment) {
  return {
    asset: await hre.addresses.getForToken(Addresses.TOKEN, token),
    pool: await hre.addresses.get(aaveVersion === 3 ? Addresses.AAVE_V3 : Addresses.AAVE_V2),
    assetPriceFeed: await hre.addresses.getForToken(Addresses.CHAINLINK, token),
    gelato: await hre.addresses.get(Addresses.GELATO),
    vault: await hre.addresses.getForToken(Addresses.VAULT, token),
    nativePriceFeed: await hre.addresses.getForToken(Addresses.CHAINLINK, TokenSymbol.WETH),
    healthCheck: await hre.addresses.get(Addresses.HEALTH_CHECK),
  }
}
