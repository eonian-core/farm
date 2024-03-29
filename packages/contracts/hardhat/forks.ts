import type { HardhatNetworkUserConfig } from 'hardhat/types'
import { Chain } from './types'

const chainToURL: Record<Chain, string | undefined> = {
  [Chain.UNKNOWN]: 'http://127.0.0.1:8545/',
  [Chain.BSC]: process.env.BSC_MAINNET_RPC_URL,
}

export function resolveHardhatForkConfig() {
  const forkChain = getChainForFork()
  const url = chainToURL[forkChain]
  if (!url) {
    throw new Error(`Fork RPC URL is not found for chain: ${forkChain}`)
  }
  return forkChain === Chain.UNKNOWN ? noFork() : fork(url)
}

export function getChainForFork(): Chain {
  const forkOf = process.env.HARDHAT_FORK_NETWORK
  if (!forkOf || forkOf.toLowerCase() === 'false') {
    return Chain.UNKNOWN
  }
  const chain = Object.values(Chain).find(chain => forkOf.toUpperCase() === chain)
  if (!chain) {
    throw new Error(`Chain "${forkOf}" is not valid, possible values: ${Object.values(Chain).join(', ')}`)
  }
  return chain
}

/** Setup is compatible with BSC mainnet */
function fork(url: string): HardhatNetworkUserConfig {
  return {
    forking: {
      url,
    },
    mining: {
      auto: true,
      interval: 5000,
      mempool: {
        order: 'fifo',
      },
    },
  }
}

function noFork(): HardhatNetworkUserConfig {
  return {}
}
