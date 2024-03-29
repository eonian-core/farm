import type { PendingSuiteFunction } from 'mocha'
import { type Chain, getChainForFork } from '../../../hardhat/types'

export function describeOnChain(chain: Chain, ...params: Parameters<PendingSuiteFunction>) {
  const forkChain = getChainForFork()
  return forkChain === chain ? describe(...params) : describe.skip(...params)
}
