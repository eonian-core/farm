import { Chain, ContractGroup, TokenSymbol } from '../../types'
import type { LookupMap } from './BaseProvider'
import { BaseProvider } from './BaseProvider'

export class ChainLinkProvider extends BaseProvider {
  protected getLookupMap(): LookupMap {
    return {
      [Chain.BSC]: {
        [this.ANY_ENVIRONMENT]: {
          [TokenSymbol.BNB]: '0x0567f2323251f0aab15c8dfb1967e4e8a7d42aee', // https://data.chain.link/bsc/mainnet/crypto-usd/bnb-usd
          [TokenSymbol.USDT]: '0xb97ad0e74fa7d920791e90258a6e2085088b4320', // https://data.chain.link/bsc/mainnet/crypto-usd/usdt-usd
          [TokenSymbol.USDC]: '0x51597f405303c4377e36123cbc172b13269ea163', // https://data.chain.link/bsc/mainnet/crypto-usd/usdc-usd
          [TokenSymbol.BUSD]: '0xcbb98864ef56e9042e7d2efef76141f15731b82f', // https://data.chain.link/bsc/mainnet/crypto-usd/busd-usd
          [TokenSymbol.WETH]: '0x9ef1b8c0e4f7dc8bf5719ea496883dc6401d5b2e', // https://data.chain.link/bsc/mainnet/crypto-usd/eth-usd
          [TokenSymbol.BTCB]: '0x264990fbd0a4796a3e3d8e37c4d5f87a3aca5ebf', // https://data.chain.link/bsc/mainnet/crypto-usd/btc-usd
        },
      },
    }
  }

  protected get name(): string {
    return ContractGroup.CHAINLINK_FEED
  }
}
