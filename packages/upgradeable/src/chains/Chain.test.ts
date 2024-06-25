import type { HardhatRuntimeEnvironment } from 'hardhat/types'
import { Chain, getChainForFork, getChainId, resolveChain } from './Chain'

describe(getChainForFork.name, () => {
  it('Should resolve fork chain using ENV', () => {
    const chains = Object.values(Chain)

    for (const chain of chains) {
      process.env.HARDHAT_FORK_NETWORK = chain
      const chainForFor = getChainForFork()

      expect(chainForFor).toEqual(chain)
    }
  })

  it('Should provide "UNKNOWN" if ENV is not specified', () => {
    delete process.env.HARDHAT_FORK_NETWORK
    const result = getChainForFork()
    expect(result).toEqual(Chain.UNKNOWN)
  })

  it('Should provide "UNKNOWN" if fork is disabled', () => {
    process.env.HARDHAT_FORK_NETWORK = 'false'
    const result = getChainForFork()
    expect(result).toEqual(Chain.UNKNOWN)
  })
})

describe(resolveChain.name, () => {
  it('Should provide "UNKNOWN" if network is ganache', () => {
    const result = resolveChain({
      network: {
        name: 'ganache',
      },
    } as HardhatRuntimeEnvironment)
    expect(result).toEqual(Chain.UNKNOWN)
  })

  it('Should resolve fork chain if network is hardhat', () => {
    process.env.HARDHAT_FORK_NETWORK = Chain.BSC
    const result = resolveChain({
      network: {
        name: 'hardhat',
      },
    } as HardhatRuntimeEnvironment)
    expect(result).toEqual(Chain.BSC)
  })

  it('Should resolve chain from network name', () => {
    const result = resolveChain({
      network: {
        name: 'bsc_abc_local',
      },
    } as HardhatRuntimeEnvironment)
    expect(result).toEqual(Chain.BSC)
  })
})

describe(getChainId.name, () => {
  it('Should provide id of the chain', () => {
    const result = getChainId(Chain.BSC)
    expect(result).toEqual(56)
  })
})
