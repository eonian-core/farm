import { Chain, TokenSymbol } from '../types'
import type { LookupMap } from './BaseProvider'
import { BaseProvider } from './BaseProvider'

export class ChainLinkProvider extends BaseProvider {
  protected getLookupMap(): LookupMap {
    return {
      [Chain.BSC]: {
        ANY_ENVIRONMENT: {
          [TokenSymbol.BNB]: '0x0567F2323251f0Aab15c8dFb1967E4e8A7D42aeE', // https://data.chain.link/bsc/mainnet/crypto-usd/bnb-usd
          [TokenSymbol.USDT]: '0xB97Ad0E74fa7d920791E90258A6E2085088b4320', // https://data.chain.link/bsc/mainnet/crypto-usd/usdt-usd
          [TokenSymbol.USDC]: '0x51597f405303C4377E36123cBc172b13269EA163', // https://data.chain.link/bsc/mainnet/crypto-usd/usdc-usd
          [TokenSymbol.BUSD]: '0xcbb98864ef56e9042e7d2efef76141f15731b82f', // [DECOMMISSIONED] https://data.chain.link/bsc/mainnet/crypto-usd/busd-usd
          [TokenSymbol.WETH]: '0x9ef1B8c0E4F7dc8bF5719Ea496883DC6401d5b2e', // https://data.chain.link/bsc/mainnet/crypto-usd/eth-usd
          [TokenSymbol.BTCB]: '0x264990fbd0A4796A3E3d8E37C4d5F87a3aCa5Ebf', // https://data.chain.link/bsc/mainnet/crypto-usd/btc-usd
        },
      },
    }
  }
}
