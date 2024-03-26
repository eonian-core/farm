import type { TokenInfo } from '@uniswap/token-lists'
import type { Chain } from './chains'
import { getChainId } from './chains'
import { tokens } from './tokenList.json'

const tokenLookupMap = tokens.reduce((map, token) => {
  map[token.chainId] ??= {}
  map[token.chainId][token.symbol] = token
  return map
}, {} as Record<number, Record<string, TokenInfo>>)

export function getTokenInfo(chain: Chain, symbol: string): TokenInfo {
  const tokenInfo = tokenLookupMap[getChainId(chain)]?.[symbol]
  if (!tokenInfo) {
    throw new Error(`Token info was not found (chain: ${chain}, symbol: ${symbol})!`)
  }
  return tokenInfo
}
