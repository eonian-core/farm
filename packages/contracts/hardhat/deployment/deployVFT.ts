import type { HardhatRuntimeEnvironment } from 'hardhat/types'
import { getProviders } from '../providers/addresses'
import type { VaultFounderToken } from '../../typechain-types'
import type { TokenSymbol } from '../types'
import { ContractGroup } from '../types'
import { type DeployResult, DeployStatus, Deployer } from './helpers/Deployer'

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
  const deployResult = await Deployer.performDeploy('VaultFounderToken', token, initializeArguments, hre)

  if (deployResult.status === DeployStatus.DEPLOYED) {
    await attachToVault(deployResult.proxyAddress, addresses.vault, hre)
  }

  return deployResult
}

async function attachToVault(vftAddress: string, vaultAddress: string, hre: HardhatRuntimeEnvironment) {
  const vault = await hre.ethers.getContractAt('Vault', vaultAddress)
  const tx = await vault.setFounders(vftAddress)
  await tx.wait()
}

async function getAddreses(token: TokenSymbol, hre: HardhatRuntimeEnvironment) {
  const providers = getProviders(hre)
  return {
    vault: await providers[ContractGroup.EONIAN_VAULT].getAddressForToken(token),
  }
}