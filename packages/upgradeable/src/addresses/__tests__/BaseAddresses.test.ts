import type { HardhatRuntimeEnvironment } from 'hardhat/types'
import type { LookupMap } from '../BaseAddresses'
import { BaseAddresses } from '../BaseAddresses'
import { type AvailableHardhatNetwork } from '../../availableNetworks'
import { NetworkEnvironment } from '../../environment/NetworkEnvironment'
import { Chain } from '../../chains'
import { TokenSymbol } from '../../tokens/TokenSymbol'

describe(BaseAddresses.name, () => {
  it('Should provide single (default) address', async () => {
    const hre = mockHRE('bsc_mainnet_dev')
    const provider = mockProvider(hre, {
      [Chain.BSC]: {
        [NetworkEnvironment.DEV]: 'some-address',
      },
    })
    const address = await provider.getAddress()
    expect(address).toEqual('some-address')
  })

  it('Should provide single (default) address with fallback env', async () => {
    const hre = mockHRE('bsc_mainnet_dev')
    const provider = mockProvider(hre, {
      [Chain.BSC]: {
        ANY_ENVIRONMENT: 'some-address',
      },
    })
    const address = await provider.getAddress()
    expect(address).toEqual('some-address')
  })

  it('Should provide token addresses', async () => {
    const hre = mockHRE('bsc_mainnet_dev')
    const provider = mockProvider(hre, {
      [Chain.BSC]: {
        [NetworkEnvironment.DEV]: {
          [TokenSymbol.BNB]: 'bnb-address',
          [TokenSymbol.WETH]: 'weth-address',
        },
      },
    })
    const addressBNB = await provider.getAddressForToken(TokenSymbol.BNB)
    expect(addressBNB).toEqual('bnb-address')

    const addressWETH = await provider.getAddressForToken(TokenSymbol.WETH)
    expect(addressWETH).toEqual('weth-address')
  })

  it('Should provide token addresses with fallback env', async () => {
    const hre = mockHRE('bsc_mainnet_dev')
    const provider = mockProvider(hre, {
      [Chain.BSC]: {
        ANY_ENVIRONMENT: {
          [TokenSymbol.BNB]: 'bnb-address',
          [TokenSymbol.WETH]: 'weth-address',
        },
      },
    })
    const addressBNB = await provider.getAddressForToken(TokenSymbol.BNB)
    expect(addressBNB).toEqual('bnb-address')

    const addressWETH = await provider.getAddressForToken(TokenSymbol.WETH)
    expect(addressWETH).toEqual('weth-address')
  })

  it('Should throw when trying to get single address from token-based provider', async () => {
    const hre = mockHRE('bsc_mainnet_dev')
    const provider = mockProvider(hre, {
      [Chain.BSC]: {
        [NetworkEnvironment.DEV]: {
          [TokenSymbol.BNB]: 'bnb-address',
          [TokenSymbol.WETH]: 'weth-address',
        },
      },
    })
    await expect(provider.getAddress()).rejects.toThrow()
  })

  it('Should throw when trying to get token address from single provider', async () => {
    const hre = mockHRE('bsc_mainnet_dev')
    const provider = mockProvider(hre, {
      [Chain.BSC]: {
        [NetworkEnvironment.DEV]: 'some-address',
      },
    })
    await expect(provider.getAddressForToken(TokenSymbol.BNB)).rejects.toThrow()
  })

  it('Should get value from ANY_NETWORK if specified one is missing (single provider)', async () => {
    const hre = mockHRE('bsc_mainnet_dev')
    const provider = mockProvider(hre, {
      [Chain.BSC]: {
        ANY_ENVIRONMENT: 'some-address',
      },
    })
    expect(await provider.getAddress()).toEqual('some-address')
  })

  it('Should get value from ANY_NETWORK if specified one is missing (token provider)', async () => {
    const hre = mockHRE('bsc_mainnet_dev')
    const provider = mockProvider(hre, {
      [Chain.BSC]: {
        ANY_ENVIRONMENT: {
          [TokenSymbol.BNB]: 'bnb-address',
        },
      },
    })
    expect(await provider.getAddressForToken(TokenSymbol.BNB)).toEqual('bnb-address')
  })

  it('Should throw if address is not found (single provider)', async () => {
    const hre = mockHRE('bsc_mainnet_dev')
    const provider = mockProvider(hre, {
      [Chain.UNKNOWN]: {
        [NetworkEnvironment.DEV]: 'some-address',
      },
    })
    await expect(provider.getAddress()).rejects.toThrow()
  })

  it('Should throw if address is not found (token provider)', async () => {
    const hre = mockHRE('bsc_mainnet_dev')
    const provider = mockProvider(hre, {
      [Chain.UNKNOWN]: {
        [NetworkEnvironment.DEV]: {
          [TokenSymbol.BNB]: 'bnb-address',
        },
      },
    })
    await expect(provider.getAddressForToken(TokenSymbol.BNB)).rejects.toThrow()
  })

  it('Should validate address (single provider)', async () => {
    const hre = mockHRE('bsc_mainnet_dev')
    let provider = mockProvider(
      hre,
      {
        [Chain.BSC]: {
          ANY_ENVIRONMENT: 'some-address',
        },
      },
      (address) => {
        return address === 'some-address'
      },
    )
    expect(await provider.getAddress()).toEqual('some-address')

    provider = mockProvider(
      hre,
      {
        [Chain.BSC]: {
          ANY_ENVIRONMENT: 'some-address',
        },
      },
      () => false,
    )
    await expect(provider.getAddress()).rejects.toThrow()
  })

  it('Should validate address (token provider)', async () => {
    const hre = mockHRE('bsc_mainnet_dev')
    const provider = mockProvider(
      hre,
      {
        [Chain.BSC]: {
          ANY_ENVIRONMENT: {
            [TokenSymbol.BNB]: 'valid',
            [TokenSymbol.WETH]: 'invalid',
          },
        },
      },
      (address, token) => {
        return token === TokenSymbol.BNB
      },
    )
    expect(await provider.getAddressForToken(TokenSymbol.BNB)).toEqual('valid')
    await expect(provider.getAddressForToken(TokenSymbol.WETH)).rejects.toThrow()
  })
})

function mockProvider(hre: HardhatRuntimeEnvironment, map: LookupMap | PromiseLike<LookupMap>, validate?: (address: string, token: TokenSymbol | null) => boolean): BaseAddresses {
  class StubProvider extends BaseAddresses {
    protected getLookupMap(): LookupMap | PromiseLike<LookupMap> {
      return map
    }

    protected validateAddress(address: string, token: TokenSymbol | null): Promise<boolean> {
      return Promise.resolve(validate ? validate(address, token) : true)
    }
  }
  return new StubProvider(hre)
}

function mockHRE(networkName: AvailableHardhatNetwork) {
  return {
    network: {
      name: networkName,
    },
  } as HardhatRuntimeEnvironment
}
