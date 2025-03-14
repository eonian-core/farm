import { BaseAddresses, Chain, TokenSymbol } from '@eonian/upgradeable'
import type { LookupMap } from '@eonian/upgradeable'
import { ZeroAddress } from 'ethers'
import { ERC20 } from './ERC20'

export class AaveV3LikePool extends BaseAddresses {
  /**
   * Aave: https://aave.com/docs/resources/addresses
   */
  protected getLookupMap(): LookupMap {
    return {
      [Chain.ETH]: {
        ANY_ENVIRONMENT: '0x87870Bca3F3fD6335C3F4ce8392D69350B4fA4E2',
      },
      [Chain.BSC]: {
        ANY_ENVIRONMENT: '0x6807dc923806fE8Fd134338EABCA509979a7e0cB',
      },
    }
  }

  protected override async validateAddress(address: string): Promise<boolean> {
    const contract = await this.hre.ethers.getContractAt('IAaveV3Pool', address)
    const usdcAddress = await new ERC20(this.hre).getAddressForToken(TokenSymbol.USDC)
    const data = await contract.getReserveData(usdcAddress)
    return data.aTokenAddress !== ZeroAddress
  }
}
