/* eslint-disable import/first */
import * as dotenv from 'dotenv'

dotenv.config() // must be before all imports

import type { HardhatUserConfig, NetworkUserConfig } from 'hardhat/types/config'
import '@nomicfoundation/hardhat-ethers'
import '@nomiclabs/hardhat-etherscan'
import '@typechain/hardhat'
import 'hardhat-gas-reporter'
import 'solidity-coverage'
import '@openzeppelin/hardhat-upgrades'

// import 'hardhat-tracer'
import 'hardhat-docgen'
import '@nomicfoundation/hardhat-chai-matchers'
import '@nomicfoundation/hardhat-foundry'

import './hardhat/types'
import './hardhat/deployment/plugins'
import './hardhat/tasks'

import { resolveHardhatForkConfig } from './hardhat/forks'

const bscMainnet: NetworkUserConfig = {
  url: 'https://bsc-dataseed.binance.org/',
  chainId: 56,
  accounts: [process.env.BSC_MAINNET_PRIVATE_KEY].filter(Boolean) as Array<string>,
  verify: {
    etherscan: {
      apiUrl: 'https://api.bscscan.com/',
      apiKey: process.env.BSCSCAN_API_KEY,
    },
  },
}

const config: HardhatUserConfig = {
  defaultNetwork: 'hardhat',
  solidity: {
    version: '0.8.19',
    settings: {
      optimizer: {
        enabled: true,
        runs: 5, // must be low to decrease result contract code size
      },
    },
  },
  availableNetworks: {
    hardhat: resolveHardhatForkConfig(),
    ganache: {
      url: 'http://127.0.0.1:7545',
      accounts: [
        'ddf2c3d3e92baf6c868bccb6594559c46e1f6da05914a5d7e940cba8fd96fc01',
      ],
    },
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
  gasReporter: {
    enabled: process.env.REPORT_GAS !== undefined,
    currency: 'USD',
  },
  paths: {
    sources: './src',
    tests: './test',
    cache: './cache_hardhat',
    artifacts: './artifacts',
  },
}

config.networks = config.availableNetworks

export default config
