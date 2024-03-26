import chains from './chains.json'

export enum Chain {
  BSC = 'BSC',
  SEPOLIA = 'SEPOLIA',
}

export function getChainId(chain: Chain): number {
  return chains.find(({ chain: chainSymbol }) => chainSymbol === chain)!.chainId
}
