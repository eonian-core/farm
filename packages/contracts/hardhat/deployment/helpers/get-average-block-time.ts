import { Chain, resolveChain } from '@eonian/upgradeable'
import type { HardhatRuntimeEnvironment } from 'hardhat/types'

const SECONDS_PER_BLOCK: Partial<Record<Chain, number>> = {
  [Chain.BSC]: 1.5,
  [Chain.ETH]: 12.02,
}

const cache: Partial<Record<Chain, number>> = {}

/**
 * Returns the seconds per block. Verifies that the block rate is not changed on the blockchain.
 *
 * @param hre - Hardhat runtime environment.
 * @returns The seconds per block.
 */
export async function getAverageBlockTimeInSeconds(hre: HardhatRuntimeEnvironment): Promise<number> {
  const cacheKey = resolveChain(hre)
  if (cache[cacheKey]) {
    return cache[cacheKey]
  }

  const predefinedSecondsPerBlock = getPredefinedSecondsPerBlock(hre)
  const secondsPerBlock = await getSecondsPerBlockFromBlockchain(hre)
  const differenceFactor = getDifferenceFactor(secondsPerBlock, predefinedSecondsPerBlock)
  if (differenceFactor >= 0.1) {
    throw new Error(`Seconds per block difference is too high: ${differenceFactor} (predifined: ${predefinedSecondsPerBlock}, on blockchain: ${secondsPerBlock})! Was block rate changed on the blockchain? Please update the "SECONDS_PER_BLOCK" constant.`)
  }

  cache[cacheKey] = predefinedSecondsPerBlock

  return cache[cacheKey]
}

/**
 * Returns a symmetrical difference factor (percentage between 0 and 1) between two numbers.
 * Calculated as `|a-b|/max(a,b)`.
 * E.g. if a = 3.0 and b = 2.7, the factor is 0.1.
 * Or if a = 2.7 and b = 3.0, the factor is also 0.1.
 */
function getDifferenceFactor(a: number, b: number): number {
  if (a === b) {
    return 0
  }
  return Math.abs(a - b) / Math.max(a, b)
}

/**
 * Returns the seconds per block from the predefined constant.
 * Do not use this function directly, use `getAverageBlockTimeInSeconds` instead.
 * This function is used to get the seconds per block for the chain that is being forked (e.g. in tests).
 *
 * @param hre - Hardhat runtime environment.
 * @returns The seconds per block.
 */
export function getPredefinedSecondsPerBlock(hre: HardhatRuntimeEnvironment): number {
  const chain = resolveChain(hre)
  const secondsPerBlock = SECONDS_PER_BLOCK[chain]
  if (secondsPerBlock === undefined) {
    throw new Error(`Missing value in "SECONDS_PER_BLOCK" for ${chain}`)
  }
  return secondsPerBlock
}

/**
 * Returns the seconds per block from the blockchain.
 * It samples multiple blocks over a period to calculate an average,
 * with a timeout to prevent indefinite waiting.
 *
 * We have to collect multiple blocks because the timestamp is represented in seconds,
 * but in some blockchains the interval between blocks is fractions of seconds.
 * For instance, on BSC the interval is 1.5 seconds, so we need to collect 5 blocks to get a good average
 * between first and the last block.
 *
 * @param hre - Hardhat runtime environment.
 * @returns The seconds per block.
 */
async function getSecondsPerBlockFromBlockchain(hre: HardhatRuntimeEnvironment): Promise<number> {
  const NUM_SAMPLES_TARGET = 5
  const MAX_COLLECTION_TIME_MS = 60 * 1000
  const POLL_INTERVAL_MS = 1000

  const provider = hre.ethers.provider
  const collectedBlockInfo: Array<{ number: number; timestamp: number }> = []
  const startTime = Date.now()
  let lastFetchedBlockNumber = -1

  const initialBlock = await provider.getBlock('latest')
  if (!initialBlock) {
    throw new Error('Failed to fetch the initial block from the blockchain.')
  }
  collectedBlockInfo.push({ number: initialBlock.number, timestamp: initialBlock.timestamp })
  lastFetchedBlockNumber = initialBlock.number

  while (collectedBlockInfo.length < NUM_SAMPLES_TARGET && Date.now() - startTime < MAX_COLLECTION_TIME_MS) {
    await new Promise(resolve => setTimeout(resolve, POLL_INTERVAL_MS))

    if (Date.now() - startTime >= MAX_COLLECTION_TIME_MS) {
      break
    }

    const currentBlock = await provider.getBlock('latest')
    if (currentBlock && currentBlock.number > lastFetchedBlockNumber) {
      collectedBlockInfo.push({ number: currentBlock.number, timestamp: currentBlock.timestamp })
      lastFetchedBlockNumber = currentBlock.number
    }
  }

  if (collectedBlockInfo.length < 2) {
    const elapsedSeconds = (Date.now() - startTime) / 1000
    throw new Error(
      `Failed to collect at least two distinct blocks within the ${MAX_COLLECTION_TIME_MS / 1000}s timeout (actual duration: ${elapsedSeconds.toFixed(1)}s). Collected ${collectedBlockInfo.length} block(s). This may indicate that the network is not producing new blocks or is very slow.`,
    )
  }

  const firstSample = collectedBlockInfo[0]
  const lastSample = collectedBlockInfo[collectedBlockInfo.length - 1]
  const blockNumberDifference = lastSample.number - firstSample.number
  const timestampDifferenceSeconds = lastSample.timestamp - firstSample.timestamp
  if (blockNumberDifference <= 0) {
    throw new Error(
      `Internal error or unexpected blockchain data: Collected block samples do not show block number progression. First sample: #${firstSample.number}, Last sample: #${lastSample.number}. Total samples collected: ${collectedBlockInfo.length}.`,
    )
  }

  return timestampDifferenceSeconds / blockNumberDifference
}
