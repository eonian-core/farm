import { task } from 'hardhat/config'
import type { HardhatRuntimeEnvironment } from 'hardhat/types'

export const estimateSecondsPerBlockTask = task('get-seconds-per-block', 'Prints number of seconds per block', async (taskArgs, hre) => {
  const result = await estimateSecondsPerBlock(hre)
  console.log(`${result.toFixed(2)}s`)
})

async function estimateSecondsPerBlock(hre: HardhatRuntimeEnvironment, blockDifference = 10): Promise<number> {
  const provider = hre.ethers.getDefaultProvider()

  const latestBlockNumber = await provider.getBlockNumber()
  const pastBlockNumber = latestBlockNumber - blockDifference

  const latestBlock = await provider.getBlock(latestBlockNumber)
  const pastBlock = await provider.getBlock(pastBlockNumber)

  if (!latestBlock || !pastBlock) {
    throw new Error('Cannot get block info')
  }

  const timeDifference = latestBlock.timestamp - pastBlock.timestamp
  const averageSecondsPerBlock = timeDifference / blockDifference

  return averageSecondsPerBlock
}
