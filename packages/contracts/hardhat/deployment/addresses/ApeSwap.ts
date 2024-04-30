import { Chain, TokenSymbol } from '../../types'
import type { LookupMap } from './BaseAddresses'
import { BaseAddresses } from './BaseAddresses'

export class ApeSwap extends BaseAddresses {
  protected getLookupMap(): LookupMap {
    return {
      [Chain.BSC]: {
        ANY_ENVIRONMENT: {
          [TokenSymbol.USDT]: '0xdBFd516D42743CA3f1C555311F7846095D85F6Fd',
          [TokenSymbol.USDC]: '0x91b66a9ef4f4cad7f8af942855c37dd53520f151',
          [TokenSymbol.BUSD]: '0x0096b6b49d13b347033438c4a699df3afd9d2f96',
          [TokenSymbol.WETH]: '0xaA1b1E1f251610aE10E4D553b05C662e60992EEd',
          [TokenSymbol.BTCB]: '0x5fce5D208DC325ff602c77497dC18F8EAdac8ADA',
        },
      },
    }
  }

  protected override async validateAddress(address: string, token: TokenSymbol | null): Promise<boolean> {
    const contract = await this.hre.ethers.getContractAt('IERC20Metadata', address)
    const cTokenSymbol = await contract.symbol()
    return cTokenSymbol === `o${this.renameSymbol(token)}`
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
