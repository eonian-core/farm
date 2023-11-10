import type { Contract, Signer } from 'ethers'
import { ethers } from 'hardhat'
import type { IERC20 } from '../../../typechain-types'

export default async function getToken(token: string, signer?: Signer | string): Promise<IERC20 & Contract> {
  return await ethers.getContractAt<IERC20 & Contract>('IERC20', token, signer)
}
