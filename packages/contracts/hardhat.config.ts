/* eslint-disable import/first */
import * as dotenv from 'dotenv'

dotenv.config() // must be before all imports

import type { HardhatUserConfig, NetworkUserConfig } from 'hardhat/types/config'
import '@nomicfoundation/hardhat-ethers'
import '@nomicfoundation/hardhat-verify'
import '@typechain/hardhat'
import 'hardhat-gas-reporter'
import 'solidity-coverage'
import '@openzeppelin/hardhat-upgrades'

// import 'hardhat-tracer' -> Disabled, does not work with the recent version of Hardhat & ethers.
import 'hardhat-docgen'
import '@nomicfoundation/hardhat-chai-matchers'
import '@nomicfoundation/hardhat-foundry'

import '@eonian/upgradeable'

import { Chain, getChainForFork, resolveHardhatForkConfig } from '@eonian/upgradeable'
import './hardhat/deployment'
import './hardhat/tasks'
import './hardhat/overrides'

console.log('OPENZEPPLIN_DEFENDER_DEPLOY', process.env.OPENZEPPLIN_DEFENDER_DEPLOY)
console.log('HARDHAT_NETWORK', process.env.HARDHAT_NETWORK)

const bscMainnet: NetworkUserConfig = {
  url: 'https://bsc-dataseed.binance.org/',
  chainId: 56,
  accounts: [process.env.BSC_MAINNET_PRIVATE_KEY].filter(Boolean) as Array<string>,
  gasMultiplier: 1.1,
}

const config: HardhatUserConfig = {
  defaultNetwork: 'hardhat',
  solidity: {
    version: '0.8.26',
    settings: {
      optimizer: {
        enabled: true,
        runs: 5, // must be low to decrease result contract code size
      },
    },
  },
  availableNetworks: {
    hardhat: resolveHardhatForkConfig(),
    bsc_mainnet_dev: {
      ...bscMainnet,
    },
    bsc_mainnet_staging: {
      ...bscMainnet,
    },
    bsc_mainnet_prod: {
      ...bscMainnet,
    },
  },
  etherscan: {
    apiKey: {
      bsc: process.env.BSCSCAN_API_KEY!,
    },
  },
  sourcify: {
    enabled: false,
  },
  gasReporter: {
    enabled: process.env.REPORT_GAS !== undefined,
    currency: 'USD',
  },
  paths: {
    sources: './src',
    tests: getPathForTests(),
    cache: './cache_hardhat',
    artifacts: './artifacts',
  },
  mocha: {
    timeout: 2 * 60 * 1000,
  },
  defender: {
    apiKey: process.env.OPENZEPPLIN_DEFENDER_API_KEY!,
    apiSecret: process.env.OPENZEPPLIN_DEFENDER_API_SECRET!,
    network: process.env.OPENZEPPLIN_DEFENDER_NETWORK || "bsc",
    // OPENZEPPLIN_DEFENDER_DEPLOY also used directly in the code to avoid fallback to ethers.js
    useDefenderDeploy: process.env.OPENZEPPLIN_DEFENDER_DEPLOY === 'true',
  }
}

function getPathForTests(root = './test') {
  const chain = getChainForFork()
  return chain === Chain.UNKNOWN ? root : `${root}/integration/${chain.toLowerCase()}`
}

config.networks = config.availableNetworks

export default config
