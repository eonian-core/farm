import type { HardhatNetworkUserConfig } from 'hardhat/types'
import { Chain, getChainForFork } from './Chain'

const chainToURL: Record<Chain, string | undefined> = {
  [Chain.UNKNOWN]: 'http://127.0.0.1:8545/',
  [Chain.BSC]: process.env.BSC_MAINNET_RPC_URL,
  [Chain.ETH]: process.env.ETH_MAINNET_RPC_URL,
}

const miningInterval: Record<Chain, number> = {
  [Chain.UNKNOWN]: 5000,
  [Chain.BSC]: 1500,
  [Chain.ETH]: 5000,
}

export function resolveHardhatForkConfig() {
  const forkChain = getChainForFork()
  const url = chainToURL[forkChain]
  if (!url) {
    throw new Error(`Fork RPC URL is not found for chain: ${forkChain}`)
  }
  return forkChain === Chain.UNKNOWN ? noFork() : fork(url, miningInterval[forkChain])
}

/** Setup is compatible with BSC mainnet */
function fork(url: string, miningInterval: number): HardhatNetworkUserConfig {
  return {
    forking: {
      url,
    },
    mining: {
      auto: true,
      interval: miningInterval,
      mempool: {
        order: 'fifo',
      },
    },
  }
}

function noFork(): HardhatNetworkUserConfig {
  return {}
}
