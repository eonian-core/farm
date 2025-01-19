import hre from 'hardhat'
import { type BaseContract } from 'ethers'
import type { ContractName } from 'hardhat/types'
import type { TokenSymbol } from '@eonian/upgradeable'
import { getAddress } from './get-address'

export async function getContractAt<R extends BaseContract>(contractName: ContractName, token?: TokenSymbol) {
  const address = await getAddress(contractName, token)
  return await hre.ethers.getContractAt(contractName, address) as unknown as R
}
