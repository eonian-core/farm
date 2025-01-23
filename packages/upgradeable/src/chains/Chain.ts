import type { HardhatRuntimeEnvironment } from 'hardhat/types'

import chains from './chains.json'

export enum Chain {
  UNKNOWN = 'UNKNOWN',
  ETH = 'ETH',
  BSC = 'BSC',
  CROSSFI = 'CROSSFI',
  CROSSFI_TESTNET = 'CROSSFI_TESTNET',
}

export function resolveChain(hre: HardhatRuntimeEnvironment): Chain {
  const hardhatNetwork = hre.network.name

  // "Ganache" is a local running evm node.
  if (hardhatNetwork === 'ganache') {
    return Chain.UNKNOWN
  }

  // "Hardhat" is a local running node that can be a fork of a real node.
  if (hardhatNetwork === 'hardhat') {
    return getChainForFork()
  }

  const [chainName, chainType] = hardhatNetwork.split('_')
  const chainString = `${chainName}_${chainType}`
  // try find full name
  let chain = Object.values(Chain).find(chain => chain.toLowerCase() === chainString)
  if(chain) {
    return chain
  }

  console.log(`Unable to resolve chain full name ${chainString}, will try short name ${chainName}`)
  // try find short name
  chain = Object.values(Chain).find(chain => chain.toLowerCase() === chainName)
  if (!chain) {
    throw new Error(`Unable to resolve chain from: ${hardhatNetwork}, got: ${chainName}!`)
  }
  return chain
}

export function getChainId(chain: Chain): number {
  return chains.find(({ chain: chainSymbol }) => chainSymbol === chain)!.chainId
}

export function getChainForFork(): Chain {
  const forkOf = process.env.HARDHAT_FORK_NETWORK
  if (!forkOf || forkOf.toLowerCase() === 'false') {
    return Chain.UNKNOWN
  }
  const chain = Object.values(Chain).find(chain => forkOf.toUpperCase() === chain)
  if (!chain) {
    throw new Error(`Chain "${forkOf}" is not valid, possible values: ${Object.values(Chain).join(', ')}`)
  }
  return chain
}
