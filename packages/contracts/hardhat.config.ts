import * as dotenv from "dotenv";

import fs from "fs";
import { task } from "hardhat/config";
import { HardhatUserConfig } from "hardhat/types/config";
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

dotenv.config();

task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

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
    },
    ganache: {
      url: "http://127.0.0.1:8545",
      forking: ethereumFork,
    },
    bsc_testnet: {
      url: "https://data-seed-prebsc-1-s1.binance.org:8545",
      chainId: 97,
      accounts: [process.env.BSC_TESTNET_PRIVATE_KEY].filter(
        Boolean
      ) as Array<string>,
    },
    bsc_mainnet: {
      url: "https://bsc-dataseed.binance.org/",
      chainId: 56,
      accounts: [process.env.BSC_MAINNET_PRIVATE_KEY].filter(
        Boolean
      ) as Array<string>,
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
