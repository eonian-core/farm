import hre from 'hardhat'
import { getAverageBlockTimeInSeconds } from '../../../hardhat/deployment/helpers/get-average-block-time'

export default async function warp(time: number) {
  const { ethers } = hre
  const blockTime = getAverageBlockTimeInSeconds(hre)
  const blockTimeInt = Math.round(blockTime)
  const blocks = Math.ceil(time / blockTimeInt)
  // https://hardhat.org/hardhat-network/docs/reference#hardhat_mine
  await ethers.provider.send('hardhat_mine', [`0x${blocks.toString(16)}`, `0x${blockTimeInt.toString(16)}`])
}
