import { BaseAddresses, Chain, TokenSymbol, getTokenAddress } from '@eonian/upgradeable'
import type { LookupMap } from '@eonian/upgradeable'

export class ERC20 extends BaseAddresses {
  protected getLookupMap(): LookupMap {
    return {
      [Chain.BSC]: {
        ANY_ENVIRONMENT: {
          [TokenSymbol.USDT]: getTokenAddress(Chain.BSC, TokenSymbol.USDT),
          [TokenSymbol.USDC]: getTokenAddress(Chain.BSC, TokenSymbol.USDC),
          [TokenSymbol.BUSD]: getTokenAddress(Chain.BSC, TokenSymbol.BUSD),
          [TokenSymbol.WETH]: getTokenAddress(Chain.BSC, TokenSymbol.WETH),
          [TokenSymbol.BTCB]: '0x7130d2A12B9BCbFAe4f2634d864A1Ee1Ce3Ead9c',
        },
      },
      [Chain.ETH]: {
        ANY_ENVIRONMENT: {
          [TokenSymbol.USDC]: getTokenAddress(Chain.ETH, TokenSymbol.USDC),
        },
      },
    }
  }

  protected override async validateAddress(address: string, token: TokenSymbol | null): Promise<boolean> {
    const contract = await this.hre.ethers.getContractAt('IERC20Metadata', address)
    return this.renameSymbol(token) === await contract.symbol()
  }

  private renameSymbol(token: TokenSymbol | null): string | null {
    switch (token) {
      case TokenSymbol.WETH:
        return 'ETH'
      default:
        return token
    }
  }
}
