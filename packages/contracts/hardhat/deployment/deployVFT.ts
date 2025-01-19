import type { HardhatRuntimeEnvironment } from 'hardhat/types'
import { type DeployResult, DeployStatus, type TokenSymbol, needUseSafe, sendTxWithRetry } from '@eonian/upgradeable'
import type { BaseContract } from 'ethers'
import type { VaultFounderToken } from '../../typechain-types'
import { Addresses, forceAttachTransactions } from './addresses'

const contractName = 'VaultFounderToken'

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
  const deployResult = await hre.deploy(contractName, token, initializeArguments)

  if (deployResult.status === DeployStatus.DEPLOYED || forceAttachTransactions()) {
    await attachToVault(deployResult.proxyAddress, token, addresses.vault, hre)
  }

  return deployResult
}

async function attachToVault(vftAddress: string, token: TokenSymbol, vaultAddress: string, hre: HardhatRuntimeEnvironment) {
  console.log(`Attaching Vault Founder Token to vault:\n\tVFT:${vftAddress}\n\tVault:${vaultAddress}`)

  const vault = await hre.ethers.getContractAt('Vault', vaultAddress)

  if (needUseSafe()) {
    await hre.proposeSafeTransaction({
      sourceContractName: contractName,
      deploymentId: token,
      address: vaultAddress,
      contract: vault as BaseContract,
      functionName: 'setFounders',
      args: [vftAddress],
    })
  }
  else {
    await sendTxWithRetry(() => vault.setFounders(vftAddress))
  }

  console.log('VFT attached successfully!')
}

async function getAddreses(token: TokenSymbol, hre: HardhatRuntimeEnvironment) {
  return {
    vault: await hre.addresses.getForToken(Addresses.VAULT, token),
  }
}
