import type { Chain } from '../types'
import chains from './chains.json'

export function getChainId(chain: Chain): number {
  return chains.find(({ chain: chainSymbol }) => chainSymbol === chain)!.chainId
}
