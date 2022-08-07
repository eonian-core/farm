import * as dotenv from "dotenv";

import fs from "fs";
import { task } from "hardhat/config";
import { HardhatUserConfig } from "hardhat/types/config";
import "@nomiclabs/hardhat-ethers";
import "@nomiclabs/hardhat-etherscan";
import "@nomiclabs/hardhat-waffle";
import "@typechain/hardhat";
import "hardhat-gas-reporter";
import "solidity-coverage";
import "hardhat-tracer";
import "hardhat-deploy";
import "hardhat-docgen";
import "hardhat-preprocessor";

dotenv.config();

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

const config: HardhatUserConfig = {
  solidity: "0.8.15",
  networks: {
    ropsten: {
      url: process.env.ROPSTEN_URL || "",
      accounts:
        process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
    },
  },
  gasReporter: {
    enabled: process.env.REPORT_GAS !== undefined,
    currency: "USD",
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY,
  },
  paths: {
    sources: "./src",
    tests: "./test",
    cache: "./cache_hardhat",
    artifacts: "./artifacts",
  },
  preprocess: {
    eachLine: () => ({
      transform: (line: string) => {
        // Import preprocessing to add support forge libraries for hardhat
        if (line.match(/^\s*import /i)) {
          const remappings = getRemappings();
          const importPartsRegExp = /(.+)"(.+)"/g;
          const [, prefix, path] = importPartsRegExp.exec(line) ?? [];
          for (const [find, replace] of remappings) {
            if (!path.startsWith(find)) {
              continue;
            }
            line = `${prefix} "${replace + path.slice(find.length)}";`;
            break;
          }
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
