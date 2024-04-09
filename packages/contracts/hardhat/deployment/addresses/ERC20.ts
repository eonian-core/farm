import { Chain, TokenSymbol, getTokenAddress } from '../../types'
import type { LookupMap } from './BaseAddresses'
import { BaseAddresses } from './BaseAddresses'

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
    }
  }

  protected override async validateAddress(address: string, token: TokenSymbol | null): Promise<boolean> {
    const contract = await this.hre.ethers.getContractAt('IERC20Metadata', address)
    return token === await contract.symbol()
  }
}
