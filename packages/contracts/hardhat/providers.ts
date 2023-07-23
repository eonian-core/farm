import {ChainSymobls} from '@eonian/upgradeable'

/** Map of contract names to their respective addresses on blockchain */
export interface ContractAddresses {
    [name: string]: string;
}

/** Map of contracts addresses on multiple chains */
export interface ContractsOnChains {
    [chainSymbol: string]: ContractAddresses;
}

export enum ProvidersContracts {
    apeSwap__cUSDT = 'apeSwap__cUSDT',
    apeSwap__cUSDC = 'apeSwap__cUSDC',
    apeSwap__cBUSD = 'apeSwap__cBUSD',

    chainlink__BNB_USD_feed = 'chainlink__BNB_USD_feed',
    chainlink__USDT_USD_feed = 'chainlink__USDT_USD_feed',
    chainlink__USDC_USD_feed = 'chainlink__USDC_USD_feed',
    chainlink__BUSD_USD_feed = 'chainlink__BUSD_USD_feed',
}

export const providers: ContractsOnChains = {
    [ChainSymobls.BSC]: {
        // --------------------------- ApeSwap contracts --------------------------------
        [ProvidersContracts.apeSwap__cUSDT]: '0xdBFd516D42743CA3f1C555311F7846095D85F6Fd', // https://bscscan.com/address/0xdbfd516d42743ca3f1c555311f7846095d85f6fd#code
        [ProvidersContracts.apeSwap__cUSDC]: '0x91b66a9ef4f4cad7f8af942855c37dd53520f151', // https://bscscan.com/address/0x91b66a9ef4f4cad7f8af942855c37dd53520f151#code
        [ProvidersContracts.apeSwap__cBUSD]: '0x0096b6b49d13b347033438c4a699df3afd9d2f96', // https://bscscan.com/address/0x0096b6b49d13b347033438c4a699df3afd9d2f96#code

        // --------------------------- Chainlink contracts --------------------------------
        [ProvidersContracts.chainlink__BNB_USD_feed]: '0x0567f2323251f0aab15c8dfb1967e4e8a7d42aee',  // https://data.chain.link/bsc/mainnet/crypto-usd/bnb-usd
        [ProvidersContracts.chainlink__USDT_USD_feed]: '0xb97ad0e74fa7d920791e90258a6e2085088b4320', // https://data.chain.link/bsc/mainnet/crypto-usd/usdt-usd
        [ProvidersContracts.chainlink__USDC_USD_feed]: '0x51597f405303c4377e36123cbc172b13269ea163', // https://data.chain.link/bsc/mainnet/crypto-usd/usdc-usd
        [ProvidersContracts.chainlink__BUSD_USD_feed]: '0xcbb98864ef56e9042e7d2efef76141f15731b82f'  // https://data.chain.link/bsc/mainnet/crypto-usd/busd-usd
    }
}