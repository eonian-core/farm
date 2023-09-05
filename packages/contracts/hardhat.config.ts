/* eslint-disable import/first */
import * as dotenv from 'dotenv'

dotenv.config() // must be before all imports

import { task } from 'hardhat/config'
import type { HardhatUserConfig, NetworkUserConfig } from 'hardhat/types/config'
import '@nomiclabs/hardhat-ethers'
import '@nomiclabs/hardhat-etherscan'
import '@typechain/hardhat'
import 'hardhat-gas-reporter'
import 'solidity-coverage'
import '@openzeppelin/hardhat-upgrades'
import 'hardhat-tracer'
import 'hardhat-deploy'
import 'hardhat-docgen'
import '@nomicfoundation/hardhat-chai-matchers'
import '@nomicfoundation/hardhat-foundry'

import type { Address } from 'hardhat-deploy/types'
import { ChainSymobls, getTokenBySymbol } from '@eonian/upgradeable'

import { binanceSmartChainFork, ethereumFork } from './hardhat/forks'
import { ProvidersContracts, providers } from './hardhat/providers'

import './hardhat/tasks/start-hardhat-node.ts'

task('accounts', 'Prints the list of accounts', async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners()

  for (const account of accounts) {
    console.log(account.address)
  }
})

/** Stage to which contracts is deployed, allow create multiple protocol stages on one blockchain */
export enum Stage {
  Development = 'development',
  Staging = 'staging',
  Production = 'production',
}

/** Blockchain to deploy */
export enum BlockchainType {
  Local = 'local',
  Testnet = 'testnet',
  Mainnet = 'mainnet',
}

export interface NamedAccounts {
  /** Deploy of contracts */
  deployer: Address
  /** Address required for setup Gelato Job */
  gelatoOps: Address
  /** Address for specific asset */
  USDT: Address
  /** Address of Eonian treasury */
  treasury: Address
  /** Address of ApeSwap cUSDT token / USDT lending market / Ola Tether USD (oUSDT) */
  apeSwap__cUSDT: Address
  /** Address of Chainlink BNB/USD price feed */
  chainlink__BNB_USD_feed: Address
  /** Address of Chainlink USDT/USD price feed */
  chainlink__USDT_USD_feed: Address
}

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

const defaultNetwork = 'hardhat'
console.log(`Current network: "${process.env.HARDHAT_NETWORK || defaultNetwork}"`)

const config: HardhatUserConfig = {
  defaultNetwork,
  solidity: {
    version: '0.8.19',
    settings: {
      optimizer: {
        enabled: true,
        runs: 5, // must be low to decrease result contract code size
      },
    },
  },
  networks: {
    hardhat: {
      forking: binanceSmartChainFork,
      mining: {
        auto: true,
        interval: 5000,
        mempool: {
          order: 'fifo',
        },
      },
      // Important to keep first tag as Stage
      tags: [Stage.Development, BlockchainType.Local],
    },
    ganache: {
      url: 'http://127.0.0.1:8545',
      forking: ethereumFork,
      tags: [Stage.Development, BlockchainType.Local],
    },
    bsc_testnet: {
      url: 'https://data-seed-prebsc-1-s1.binance.org:8545',
      chainId: 97,
      accounts: [process.env.BSC_TESTNET_PRIVATE_KEY].filter(Boolean) as Array<string>,
      tags: [Stage.Development, BlockchainType.Testnet],
    },
    bsc_mainnet_dev: {
      ...bscMainnet,
      tags: [Stage.Development, BlockchainType.Mainnet],
    },
    bsc_mainnet_staging: {
      ...bscMainnet,
      tags: [Stage.Staging, BlockchainType.Mainnet],
    },
    bsc_mainnet_prod: {
      ...bscMainnet,
      tags: [Stage.Production, BlockchainType.Mainnet],
    },
    // https://chainlist.org/chain/5
    // https://www.alchemy.com/overviews/sepolia-testnet
    // https://sepolia.etherscan.io/
    // https://sepoliafaucet.com/
    sepolia: {
      chainId: 11155111,
      url: process.env.SEPOLIA_RPC_URL,
      gasPrice: 1500000000, // default gas price sometimes is too low
      accounts: [process.env.SEPOLIA_PRIVATE_KEY].filter(Boolean) as Array<string>,
      verify: {
        etherscan: {
          apiUrl: 'https://api-sepolia.etherscan.io/',
          apiKey: process.env.SEPOLIA_ETHERSCAN_API_KEY,
        },
      },
      tags: [Stage.Development, BlockchainType.Testnet],
    },
  },
  gasReporter: {
    enabled: process.env.REPORT_GAS !== undefined,
    currency: 'USD',
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
      bsc_mainnet_dev: '0x527a819db1eb0e34426297b03bae11F2f8B3A19E',
      bsc_mainnet_staging: '0x527a819db1eb0e34426297b03bae11F2f8B3A19E',
      bsc_mainnet_prod: '0x527a819db1eb0e34426297b03bae11F2f8B3A19E',
      default: '0x527a819db1eb0e34426297b03bae11F2f8B3A19E', // will use bsc address as default for hardhat network
      ropsten: '0x9C4771560d84222fD8B7d9f15C59193388cC81B3',
      etherium_mainnet: '0xB3f5503f93d5Ef84b06993a1975B9D21B962892F',
    },
    USDT: {
      // TODO: need refactor this copy-paste, but using some calculations can make code less understandable
      bsc_mainnet_dev: getTokenBySymbol(ChainSymobls.BSC, 'USDT').address,
      bsc_mainnet_staging: getTokenBySymbol(ChainSymobls.BSC, 'USDT').address,
      bsc_mainnet_prod: getTokenBySymbol(ChainSymobls.BSC, 'USDT').address,
      sepolia: '0x6175a8471C2122f778445e7E07A164250a19E661',
      default: getTokenBySymbol(ChainSymobls.BSC, 'USDT').address, // will use bsc address as default for hardhat network
    },
    USDC: {
      bsc_mainnet_dev: getTokenBySymbol(ChainSymobls.BSC, 'USDC').address,
      bsc_mainnet_staging: getTokenBySymbol(ChainSymobls.BSC, 'USDC').address,
      bsc_mainnet_prod: getTokenBySymbol(ChainSymobls.BSC, 'USDC').address,
      sepolia: '0x6175a8471C2122f778445e7E07A164250a19E661',
      default: getTokenBySymbol(ChainSymobls.BSC, 'USDC').address, // will use bsc address as default for hardhat network
    },
    BUSD: {
      bsc_mainnet_dev: getTokenBySymbol(ChainSymobls.BSC, 'BUSD').address,
      bsc_mainnet_staging: getTokenBySymbol(ChainSymobls.BSC, 'BUSD').address,
      bsc_mainnet_prod: getTokenBySymbol(ChainSymobls.BSC, 'BUSD').address,
      sepolia: '0x6175a8471C2122f778445e7E07A164250a19E661',
      default: getTokenBySymbol(ChainSymobls.BSC, 'BUSD').address, // will use bsc address as default for hardhat network
    },
    treasury: {
      bsc_mainnet_dev: 0,
      bsc_mainnet_staging: 0,
      bsc_mainnet_prod: 0,
      default: 0,
    },

    apeSwap__cUSDT: {
      bsc_mainnet_dev: providers[ChainSymobls.BSC][ProvidersContracts.apeSwap__cUSDT],
      bsc_mainnet_staging: providers[ChainSymobls.BSC][ProvidersContracts.apeSwap__cUSDT],
      bsc_mainnet_prod: providers[ChainSymobls.BSC][ProvidersContracts.apeSwap__cUSDT],
      default: providers[ChainSymobls.BSC][ProvidersContracts.apeSwap__cUSDT], // will use bsc address as default for hardhat network
    },

    apeSwap__cUSDC: {
      bsc_mainnet_dev: providers[ChainSymobls.BSC][ProvidersContracts.apeSwap__cUSDC],
      bsc_mainnet_staging: providers[ChainSymobls.BSC][ProvidersContracts.apeSwap__cUSDC],
      bsc_mainnet_prod: providers[ChainSymobls.BSC][ProvidersContracts.apeSwap__cUSDC],
      default: providers[ChainSymobls.BSC][ProvidersContracts.apeSwap__cUSDC], // will use bsc address as default for hardhat network
    },

    apeSwap__cBUSD: {
      bsc_mainnet_dev: providers[ChainSymobls.BSC][ProvidersContracts.apeSwap__cBUSD],
      bsc_mainnet_staging: providers[ChainSymobls.BSC][ProvidersContracts.apeSwap__cBUSD],
      bsc_mainnet_prod: providers[ChainSymobls.BSC][ProvidersContracts.apeSwap__cBUSD],
      default: providers[ChainSymobls.BSC][ProvidersContracts.apeSwap__cBUSD], // will use bsc address as default for hardhat network
    },

    chainlink__BNB_USD_feed: {
      bsc_mainnet_dev: providers[ChainSymobls.BSC][ProvidersContracts.chainlink__BNB_USD_feed],
      bsc_mainnet_staging: providers[ChainSymobls.BSC][ProvidersContracts.chainlink__BNB_USD_feed],
      bsc_mainnet_prod: providers[ChainSymobls.BSC][ProvidersContracts.chainlink__BNB_USD_feed],
      default: providers[ChainSymobls.BSC][ProvidersContracts.chainlink__BNB_USD_feed], // will use bsc address as default for hardhat network
    },

    chainlink__USDT_USD_feed: {
      bsc_mainnet_dev: providers[ChainSymobls.BSC][ProvidersContracts.chainlink__USDT_USD_feed],
      bsc_mainnet_staging: providers[ChainSymobls.BSC][ProvidersContracts.chainlink__USDT_USD_feed],
      bsc_mainnet_prod: providers[ChainSymobls.BSC][ProvidersContracts.chainlink__USDT_USD_feed],
      default: providers[ChainSymobls.BSC][ProvidersContracts.chainlink__USDT_USD_feed], // will use bsc address as default for hardhat network
    },

    chainlink__USDC_USD_feed: {
      bsc_mainnet_dev: providers[ChainSymobls.BSC][ProvidersContracts.chainlink__USDC_USD_feed],
      bsc_mainnet_staging: providers[ChainSymobls.BSC][ProvidersContracts.chainlink__USDC_USD_feed],
      bsc_mainnet_prod: providers[ChainSymobls.BSC][ProvidersContracts.chainlink__USDC_USD_feed],
      default: providers[ChainSymobls.BSC][ProvidersContracts.chainlink__USDC_USD_feed], // will use bsc address as default for hardhat network
    },

    chainlink__BUSD_USD_feed: {
      bsc_mainnet_dev: providers[ChainSymobls.BSC][ProvidersContracts.chainlink__BUSD_USD_feed],
      bsc_mainnet_staging: providers[ChainSymobls.BSC][ProvidersContracts.chainlink__BUSD_USD_feed],
      bsc_mainnet_prod: providers[ChainSymobls.BSC][ProvidersContracts.chainlink__BUSD_USD_feed],
      default: providers[ChainSymobls.BSC][ProvidersContracts.chainlink__BUSD_USD_feed], // will use bsc address as default for hardhat network
    },
  },
  paths: {
    sources: './src',
    tests: './test',
    cache: './cache_hardhat',
    artifacts: './artifacts',
  },
}

export default config
