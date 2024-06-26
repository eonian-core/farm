import type { Signer } from 'ethers'
import { ethers } from 'hardhat'
import type { IERC20 } from '../../../typechain-types'

export default async function getToken(token: string): Promise<IERC20> {
  return await ethers.getContractAt('IERC20', token)
}
