import type { HardhatNetworkForkingUserConfig } from 'hardhat/types'

export type ForkData = HardhatNetworkForkingUserConfig & {
  accounts: Record<string, string>
}

const bscRpcUrl = process.env.BSC_MAINNET_RPC_URL
if (!bscRpcUrl) {
  throw new Error('Missing BSC_MAINNET_RPC_URL environment variable')
}

/** Binance Smart Chain Mainnet */
export const binanceSmartChainFork: ForkData = {
  // official BSC RPC unstable use unofficail instead
  url: bscRpcUrl,
  // do not use blockNumber for BSC,
  // hardhat or providers cannot correctly exchange non latest block data
  accounts: {
    holderA: '0x8894e0a0c962cb723c1976a4421c95949be2d4e3', // Holder (Binance: Hot Wallet 6)
    holderB: '0x3c783c21a0383057d128bae431894a5c19f9cf06', // Holder (Binance Hot Wallet 8)
    ops: '0x527a819db1eb0e34426297b03bae11F2f8B3A19E', // Gelato ops
  },
}

/** Ethereum Mainnet */
export const ethereumFork: ForkData = {
  url: 'https://mainnet.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161',
  blockNumber: 14668845, // 27.04.2021
  accounts: {},
}
