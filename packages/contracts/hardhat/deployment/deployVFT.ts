import type { HardhatRuntimeEnvironment } from 'hardhat/types'
import { type DeployResult, type TokenSymbol, DeployStatus, sendTxWithRetry } from '@eonian/upgradeable'
import type { VaultFounderToken } from '../../typechain-types'
import { Addresses } from './addresses'


export default async function deployVFT(token: TokenSymbol, hre: HardhatRuntimeEnvironment): Promise<DeployResult> {
  const addresses = await getAddreses(token, hre)
  const initializeArguments: Parameters<VaultFounderToken['initialize']> = [
    100, // maxCountTokens
    12_000, // nextTokenPriceMultiplier
    200, // initialTokenPrice
    `Eonian ${token} Vault Founder Token`, // name
    `VFT.eon${token}`, // symbol
    addresses.vault, // vault
  ]
  const deployResult = await hre.deploy('VaultFounderToken', token, initializeArguments)

  if (deployResult.status === DeployStatus.DEPLOYED) {
    await attachToVault(deployResult.proxyAddress, addresses.vault, hre)
  }

  return deployResult
}

async function attachToVault(vftAddress: string, vaultAddress: string, hre: HardhatRuntimeEnvironment) {
  console.log(`Attaching Vault Founder Token to vault:\nVFT:${vftAddress}\nVault:${vaultAddress}`)

  const vault = await hre.ethers.getContractAt('Vault', vaultAddress)
  await sendTxWithRetry(() => vault.setFounders(vftAddress))

  console.log(`VFT attached successfully:\nVFT:${vftAddress}\nVault:${vaultAddress}`)
}

async function getAddreses(token: TokenSymbol, hre: HardhatRuntimeEnvironment) {
  return {
    vault: await hre.addresses.getForToken(Addresses.VAULT, token),
  }
}
