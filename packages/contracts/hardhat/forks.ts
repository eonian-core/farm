import { HardhatNetworkForkingUserConfig } from "hardhat/types";

export type ForkData = HardhatNetworkForkingUserConfig & {
  accounts: Record<string, string>;
};

/** Binance Smart Chain Mainnet */
export const binanceSmartChainFork: ForkData = {
  url: "https://bsc-dataseed.binance.org",
  blockNumber: 22600879, // 29.10.2022
  accounts: {
    holder: "0xe2fc31f816a9b94326492132018c3aecc4a93ae1", // Holder (Binance Hot Wallet)
    ops: "0x527a819db1eb0e34426297b03bae11F2f8B3A19E", // Gelato ops
  },
};

/** Ethereum Mainnet */
export const ethereumFork: ForkData = {
  url: "https://mainnet.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161",
  blockNumber: 14668845, // 27.04.2021
  accounts: {},
};
