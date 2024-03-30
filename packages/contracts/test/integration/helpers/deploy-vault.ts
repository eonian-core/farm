import type { BigNumberish, Overrides, Signer } from 'ethers'
import { toBigInt } from 'ethers'
import type { HardhatRuntimeEnvironment } from 'hardhat/types'
import _ from 'lodash'
import type { Vault } from '../../../typechain-types'
import type { TokenSymbol } from '../../../hardhat/types'

interface Options {
  asset: string
  rewards: string
  managementFee?: BigNumberish
  lockedProfitReleaseRate?: BigNumberish
  name?: string
  symbol?: string
  defaultOperators?: string[]
  foundersRewardFee?: BigNumberish
  overrides?: Overrides & { from?: string | Promise<string> }
  signer?: Signer
}

const defaultOptions: Partial<Options> = {
  managementFee: 1000, // 10%
  lockedProfitReleaseRate: toBigInt(`1${'0'.repeat(18)}`) / 3600n, // 6 hours
  name: 'Vault Token',
  symbol: 'VTN',
  defaultOperators: [],
  foundersRewardFee: 100, // 1%
}

export default async function deployVault(hre: HardhatRuntimeEnvironment, token: TokenSymbol, options: Options): Promise<Vault> {
  const { signer, ...specifiedParams } = _.defaults(options, defaultOptions)
  const deployResult = await hre.deploy('Vault', token, [
    specifiedParams.asset,
    specifiedParams.rewards,
    specifiedParams.managementFee,
    specifiedParams.lockedProfitReleaseRate,
    specifiedParams.name,
    specifiedParams.symbol,
    specifiedParams.defaultOperators,
    specifiedParams.foundersRewardFee,
  ] as Parameters<Vault['initialize']>, signer)
  return await hre.ethers.getContractAt('Vault', deployResult.proxyAddress)
}
