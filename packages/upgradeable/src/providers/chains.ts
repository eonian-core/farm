
/** Blockchain related information */
export interface Chain {
    /** Full name of blockchain, for example Etherium Mainnet */
    name: string;
    /**Blockchain short name, for example BSC */
    symbol: string;
    /** Id of chain, 1 */
    chainId: number;
    /** Base currency symobl, for example ETH */
    currency: string;
}

/** List of suported chains by this list */
export enum ChainSymobls {
    ETH = "ETH",
    BSC = "BSC",
    Sepolia = "Sepolia"
}

/** List of chains referenced by symbol */
export interface ChainList {
    [chainSymbol: string]: Chain;
}

/** Main metadata about chains */
export const chains: ChainList = {
    [ChainSymobls.ETH]: {
        name: "Etherium Mainnet",
        symbol: "ETH",
        chainId: 1,
        currency: "ETH"
    },
    [ChainSymobls.BSC]: {
        name: "Binance Smart Chain",
        symbol: "BSC",
        chainId: 56,
        currency: "BNB"
    },
    [ChainSymobls.Sepolia]: {
        name: "Sepolia Testnet",
        symbol: "Sepolia",
        chainId: 11155111,
        currency: "SepoliaETH"
    }
}