import { HardhatNetworkForkingUserConfig } from "hardhat/types";

export type ForkData = HardhatNetworkForkingUserConfig & {
  accounts: Record<string, string>;
};

/** Binance Smart Chain Mainnet */
export const binanceSmartChainFork: ForkData = {
  url: "https://bsc.rpc.blxrbdn.com",
  // do not use blockNumber for BSC, 
  // hardhat or providers cannot correctly exchange non latest block data
  accounts: {
    holderA: "0xe2fc31f816a9b94326492132018c3aecc4a93ae1", // Holder (Binance Hot Wallet)
    holderB: "0x3c783c21a0383057d128bae431894a5c19f9cf06", // Holder (Binance Hot Wallet 8)
    ops: "0x527a819db1eb0e34426297b03bae11F2f8B3A19E", // Gelato ops
  },
};

/** Ethereum Mainnet */
export const ethereumFork: ForkData = {
  url: "https://mainnet.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161",
  blockNumber: 14668845, // 27.04.2021
  accounts: {},
};
