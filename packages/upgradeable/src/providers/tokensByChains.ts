import {TokenInfo, TokenList} from '@uniswap/token-lists';

import { ChainSymobls, chains } from './chains';
// Copied from https://gateway.ipfs.io/ipns/tokens.uniswap.org
// https://tokenlists.org/token-list?url=https://gateway.ipfs.io/ipns/tokens.uniswap.org
import * as tokenlist from './tokenlist.json';

/** Dict of tokens by symbol */
export interface TokenDict {
    [tokenSymbol: string]: TokenInfo;
}

/** Dict of tokens by chain and symbol */
export interface TokensByChains {
    [chainSymbol: string]: TokenDict;
}

// must be aligned with ChainSymobls from chains.ts
/** Dict of supported tokens in main chains */
export const tokensByChains: TokensByChains = {
    [ChainSymobls.ETH]: listToDict(tokenlist.tokens, ChainSymobls.ETH),
    [ChainSymobls.BSC]: listToDict(tokenlist.tokens, ChainSymobls.BSC),
    [ChainSymobls.Sepolia]: listToDict(tokenlist.tokens, ChainSymobls.Sepolia)
}

export function listToDict(tokens: TokenInfo[], symbol: ChainSymobls): TokenDict {
    // List only tokens for current chain
    const list = tokens.filter(token => token.chainId === chains[symbol].chainId);

    const dict: TokenDict = {};
    for (const token of list) {
        dict[token.symbol] = token;
    }

    return dict;
}

export function getTokenBySymbol(chainSymbol: ChainSymobls, symbol: string): TokenInfo {
    const chainTokens = tokensByChains[chainSymbol];
    if (!chainTokens) {
        throw new Error(`Chain ${chainSymbol} and token ${symbol} pair is not found`);
    }

    return chainTokens[symbol];
}