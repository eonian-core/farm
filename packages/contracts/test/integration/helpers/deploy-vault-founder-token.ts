import type { BigNumberish, Overrides, Signer } from 'ethers'
import type { HardhatRuntimeEnvironment } from 'hardhat/types'
import type { VaultFounderToken } from '../../../typechain-types'

async function _deployVaultFounderToken(
  this: any,
  hre: HardhatRuntimeEnvironment,
  signer?: Signer,
  ...params: Parameters<VaultFounderToken['initialize']>
): Promise<VaultFounderToken> {
  const factory = await hre.ethers.getContractFactory('VaultFounderToken', signer)
  const contract = await factory.deploy(false)
  await contract.waitForDeployment()

  const transaction = await contract.initialize.call(this, ...params)
  await transaction.wait()

  return contract
}

interface Options {
  maxCountTokens: BigNumberish
  nextTokenPriceMultiplier: BigNumberish
  initialTokenPrice: BigNumberish
  overrides?: Overrides & { from?: string | Promise<string> }
  signer?: Signer
  name?: string
  symbol?: string
  vault: string
}

export default async function deployVaultFounderToken(
  hre: HardhatRuntimeEnvironment,
  {
    signer,
    maxCountTokens,
    nextTokenPriceMultiplier,
    initialTokenPrice,
    name = 'Vault Founder Token',
    symbol = 'VFT',
    vault,
  }: Options,
): Promise<VaultFounderToken> {
  return await _deployVaultFounderToken(
    hre,
    signer,
    maxCountTokens,
    nextTokenPriceMultiplier,
    initialTokenPrice,
    name,
    symbol,
    vault,
  )
}
