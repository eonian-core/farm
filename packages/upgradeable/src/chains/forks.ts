import type { HardhatNetworkUserConfig } from 'hardhat/types'
import { Chain, getChainForFork } from './Chain'

const chainToURL: Record<Chain, string | undefined> = {
  [Chain.UNKNOWN]: 'http://127.0.0.1:8545/',
  [Chain.BSC]: process.env.BSC_MAINNET_RPC_URL,
  [Chain.ETH]: process.env.ETH_MAINNET_RPC_URL,
  [Chain.CROSSFI]: process.env.CROSSFI_MAINNET_RPC_URL,
  [Chain.CROSSFI_TESTNET]: process.env.CROSSFI_TESTNET_RPC_URL,
}

export function resolveHardhatForkConfig() {
  const forkChain = getChainForFork()
  const url = chainToURL[forkChain]
  if (!url) {
    throw new Error(`Fork RPC URL is not found for chain: ${forkChain}`)
  }
  return forkChain === Chain.UNKNOWN ? noFork() : fork(url)
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
