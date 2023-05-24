import * as dotenv from "dotenv";

import fs from "fs";
import { task } from "hardhat/config";
import { HardhatUserConfig, NetworkUserConfig } from "hardhat/types/config";
import "@nomiclabs/hardhat-ethers";
import "@nomiclabs/hardhat-etherscan";
import "@typechain/hardhat";
import "hardhat-gas-reporter";
import "solidity-coverage";
import "@openzeppelin/hardhat-upgrades";
import "hardhat-tracer";
import "hardhat-deploy";
import "hardhat-docgen";
import "@nomicfoundation/hardhat-chai-matchers";

import constLinePreprocessingHook from "./hardhat/const-line-preprocessing-hook";
import "hardhat-preprocessor";

import { ethereumFork, binanceSmartChainFork } from "./hardhat/forks";

import "./hardhat/tasks/start-hardhat-node.ts";
import { Address } from "hardhat-deploy/types";

dotenv.config();

task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

/** Stage to which contracts is deployed, allow create multiple protocol stages on one blockchain */
export enum Stage {
  Development = "development",
  Staging = "staging",
  Production = "production",
}

export interface NamedAccounts {
  /** Deploy of contracts */
  deployer: Address;
  /** Address required for setup Gelato Job */
  gelatoOps: Address;
  /** Address for specific asset */
  USDT: Address;
  /** Address of Eonian treasury */
  treasury: Address;
}

const bscMainnet: NetworkUserConfig = {
  url: "https://bsc-dataseed.binance.org/",
  chainId: 56,
  accounts: [process.env.BSC_MAINNET_PRIVATE_KEY].filter(
    Boolean
  ) as Array<string>,
}

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.19",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {
      forking: binanceSmartChainFork,
      mining: {
        auto: true,
        interval: 5000,
        mempool: {
          order: "fifo",
        },
      },
      tags: [Stage.Development],
    },
    ganache: {
      url: "http://127.0.0.1:8545",
      forking: ethereumFork,
      tags: [Stage.Development],
    },
    bsc_testnet: {
      url: "https://data-seed-prebsc-1-s1.binance.org:8545",
      chainId: 97,
      accounts: [process.env.BSC_TESTNET_PRIVATE_KEY].filter(
        Boolean
      ) as Array<string>,
      tags: [Stage.Development],
    },
    bsc_mainnet_dev: {
      ...bscMainnet,
      tags: [Stage.Development],
    },
    bsc_mainnet_staging: {
      ...bscMainnet,
      tags: [Stage.Staging],
    },
    bsc_mainnet_prod: {
      ...bscMainnet,
      tags: [Stage.Production],
    },
    ropsten: {
      url: "https://ropsten.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161",
      accounts: [process.env.ROPSTEN_PRIVATE_KEY].filter(
        Boolean
      ) as Array<string>,
      verify: {
        etherscan: {
          apiUrl: "https://api-ropsten.etherscan.io/",
          apiKey: process.env.ROPSTEN_ETHERSCAN_API_KEY,
        },
      },
    },
  },
  gasReporter: {
    enabled: process.env.REPORT_GAS !== undefined,
    currency: "USD",
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY,
  },
  namedAccounts: {
    deployer: {
      default: 0, // here this will by default take the first account as deployer
      // 1: 0, // similarly on mainnet it will take the first account as deployer. Note though that depending on how hardhat network are configured, the account 0 on one network can be different than on another
      // 4: '0xA296a3d5F026953e17F472B497eC29a5631FB51B', // but for rinkeby it will be a specific address
      // "goerli": '0x84b9514E013710b9dD0811c9Fe46b837a4A0d8E0', //it can also specify a specific netwotk name (specified in hardhat.config.js)
    },
    gelatoOps: {
      // More contract addresses at https://docs.gelato.network/developer-products/gelato-ops-smart-contract-automation-hub/contract-addresses
      bsc_mainnet_dev: "0x527a819db1eb0e34426297b03bae11F2f8B3A19E",
      bsc_mainnet_staging: "0x527a819db1eb0e34426297b03bae11F2f8B3A19E",
      bsc_mainnet_prod: "0x527a819db1eb0e34426297b03bae11F2f8B3A19E",
      default: "0x527a819db1eb0e34426297b03bae11F2f8B3A19E", // will use bsc address as default for hardhat network
      ropsten: "0x9C4771560d84222fD8B7d9f15C59193388cC81B3",
      etherium_mainnet: "0xB3f5503f93d5Ef84b06993a1975B9D21B962892F",
    },
    USDT: {
      bsc_mainnet_dev: "0x55d398326f99059fF775485246999027B3197955",
      bsc_mainnet_staging: "0x55d398326f99059fF775485246999027B3197955",
      bsc_mainnet_prod: "0x55d398326f99059fF775485246999027B3197955",
      default: "0x55d398326f99059fF775485246999027B3197955", // will use bsc address as default for hardhat network
    },
    treasury: {
      bsc_mainnet_dev: 0,
      bsc_mainnet_staging: 0,
      bsc_mainnet_prod: 0,
      default: 0,
    },
  },
  paths: {
    sources: "./src",
    tests: "./test",
    cache: "./cache_hardhat",
    artifacts: "./artifacts",
  },
  preprocess: {
    eachLine: (hre) => ({
      transform: (line: string, sourceInfo) => {
        // Import preprocessing to add support forge libraries for hardhat
        if (line.match(/^\s*import /i)) {
          const remappings = getRemappings();
          const importPartsRegExp = /(.+)"(.+)"/g;
          const [, prefix, path] = importPartsRegExp.exec(line) ?? [];
          for (const [find, replace] of remappings) {
            if (!path || !path.startsWith(find)) {
              continue;
            }
            line = `${prefix} "${replace + path.slice(find.length)}";`;
            break;
          }
        }

        const { absolutePath } = sourceInfo;
        const linePreprocessor = constLinePreprocessingHook(hre, absolutePath);
        if (linePreprocessor) {
          return linePreprocessor(line, sourceInfo);
        }

        return line;
      },
    }),
  },
};

function getRemappings() {
  return fs
    .readFileSync("remappings.txt", "utf8")
    .split("\n")
    .filter(Boolean) // remove empty lines
    .map((line) => line.trim().split("="));
}

export default config;
