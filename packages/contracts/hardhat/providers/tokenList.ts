import type { TokenInfo } from '@uniswap/token-lists'
import type { Chain, TokenSymbol } from '../types'
import { getChainId } from './chains'
import { tokens } from './tokenList.json'

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
