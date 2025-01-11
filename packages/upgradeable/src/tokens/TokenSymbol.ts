import type { TokenInfo } from '@uniswap/token-lists'
import { tokens } from './tokenList.json'
import type { Chain } from '../chains/Chain'
import { getChainId } from '../chains/Chain'

export enum TokenSymbol {
  BNB = 'BNB',
  BUSD = 'BUSD',
  USDT = 'USDT',
  USDC = 'USDC',
  BTCB = 'BTCB',
  WETH = 'WETH',
}

const tokenLookupMap = tokens.reduce((map, token) => {
  map[token.chainId] ??= {}
  map[token.chainId][token.symbol] = token
  return map
}, {} as Record<number, Record<string, TokenInfo>>)

export function getTokenAddress(chain: Chain, symbol: TokenSymbol): string {
  return getTokenInfo(chain, symbol).address
}

function getTokenInfo(chain: Chain, symbol: TokenSymbol): TokenInfo {
  const tokenInfo = tokenLookupMap[getChainId(chain)]?.[symbol]
  if (!tokenInfo) {
    throw new Error(`Token info was not found (chain: ${chain}, symbol: ${symbol})!`)
  }
  return tokenInfo
}

export function parseList<T extends string>(args: unknown, name: string): T[] | null {
  if (typeof args !== 'object' || !args) {
    return null
  }
  const value = name in args ? String((args as any)[name]) : null
  if (!value) {
    return null
  }
  return value.split(',') as T[] 
}

