import type { HardhatRuntimeEnvironment } from 'hardhat/types'
import { getChainForFork } from '../forks'
import type { AvailableHardhatNetwork } from '.'

export enum Chain {
  UNKNOWN = 'UNKNOWN',
  BSC = 'BSC',
}

export function resolveChain(hre: HardhatRuntimeEnvironment): Chain {
  const hardhatNetwork = hre.network.name as AvailableHardhatNetwork

  // "Ganache" is a local running evm node.
  if (hardhatNetwork === 'ganache') {
    return Chain.UNKNOWN
  }

  // "Hardhat" is a local running node that can be a fork of a real node.
  if (hardhatNetwork === 'hardhat') {
    return getChainForFork()
  }

  const chainString = hardhatNetwork.split('_').at(0)
  const chain = Object.values(Chain).find(chain => chain.toLowerCase() === chainString)
  if (!chain) {
    throw new Error(`Unable to resolve chain from: ${hardhatNetwork}, got: ${chainString}!`)
  }
  return chain
}
