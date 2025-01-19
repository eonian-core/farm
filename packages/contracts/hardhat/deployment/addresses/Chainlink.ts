import { BaseAddresses, Chain, TokenSymbol } from '@eonian/upgradeable'
import type { LookupMap } from '@eonian/upgradeable'

export class Chainlink extends BaseAddresses {
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
      [Chain.ETH]: {
        ANY_ENVIRONMENT: {
          [TokenSymbol.USDC]: '0x8fFfFfd4AfB6115b954Bd326cbe7B4BA576818f6', // https://data.chain.link/feeds/ethereum/mainnet/usdc-usd
          [TokenSymbol.WETH]: '0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419', // https://data.chain.link/feeds/ethereum/mainnet/eth-usd
        },
      },
    }
  }

  protected override async validateAddress(address: string, token: TokenSymbol | null): Promise<boolean> {
    const contract = await this.hre.ethers.getContractAt('AggregatorV3Interface', address)
    return await contract.description() === `${this.renameSymbol(token)} / USD`
  }

  private renameSymbol(token: TokenSymbol | null): string | null {
    switch (token) {
      case TokenSymbol.BTCB:
        return 'BTC'
      case TokenSymbol.WETH:
        return 'ETH'
      default:
        return token
    }
  }
}
