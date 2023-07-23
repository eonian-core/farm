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
    chainlink__BNB_USD_feed = 'chainlink__BNB_USD_feed',
    chainlink__USDT_USD_feed = 'chainlink__USDT_USD_feed',
}

export const providers: ContractsOnChains = {
    [ChainSymobls.BSC]: {
        // --------------------------- ApeSwap contracts --------------------------------
        [ProvidersContracts.apeSwap__cUSDT]: '0xdBFd516D42743CA3f1C555311F7846095D85F6Fd', // https://bscscan.com/address/0xdbfd516d42743ca3f1c555311f7846095d85f6fd#code

        // --------------------------- Chainlink contracts --------------------------------
        [ProvidersContracts.chainlink__BNB_USD_feed]: '0x0567f2323251f0aab15c8dfb1967e4e8a7d42aee', // https://data.chain.link/bsc/mainnet/crypto-usd/bnb-usd
        [ProvidersContracts.chainlink__USDT_USD_feed]: '0xb97ad0e74fa7d920791e90258a6e2085088b4320' // https://data.chain.link/bsc/mainnet/crypto-usd/usdt-usd
    }
}