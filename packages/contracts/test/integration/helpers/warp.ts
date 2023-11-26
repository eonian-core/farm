import hre from 'hardhat'

export default async function warp(time: number, secondsPerBlock = 3) {
  const { ethers } = hre
  const blocks = Math.ceil(time / secondsPerBlock)
  await ethers.provider.send('hardhat_mine', [`0x${blocks.toString(16)}`, `0x${time.toString(16)}`])
}
