import { Chain, resolveChain } from '@eonian/upgradeable'
import type { HardhatRuntimeEnvironment } from 'hardhat/types'

const SECONDS_PER_BLOCK: Partial<Record<Chain, number>> = {
  [Chain.BSC]: 3,
  [Chain.ETH]: 12.02,
}

export function getAverageBlockTimeInSeconds(hre: HardhatRuntimeEnvironment): number {
  const chain = resolveChain(hre)
  const secondsPerBlock = SECONDS_PER_BLOCK[chain]
  if (secondsPerBlock === undefined) {
    throw new Error(`Missing value in "SECONDS_PER_BLOCK" for ${chain}`)
  }
  return secondsPerBlock
}
