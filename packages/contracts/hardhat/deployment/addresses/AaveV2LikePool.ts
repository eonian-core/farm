import { BaseAddresses, Chain, TokenSymbol } from '@eonian/upgradeable'
import type { LookupMap } from '@eonian/upgradeable'
import { ZeroAddress } from 'ethers'
import { ERC20 } from './ERC20'

export class AaveV2LikePool extends BaseAddresses {
  /**
   * Aave: https://aave.com/docs/resources/addresses (v2)
   */
  protected getLookupMap(): LookupMap {
    return {
      [Chain.ETH]: {
        ANY_ENVIRONMENT: '0x7d2768dE32b0b80b7a3454c06BdAc94A69DDc7A9',
      },
    }
  }

  protected override async validateAddress(address: string): Promise<boolean> {
    const contract = await this.hre.ethers.getContractAt('IAaveV2Pool', address)
    const usdcAddress = await new ERC20(this.hre).getAddressForToken(TokenSymbol.USDC)
    const data = await contract.getReserveData(usdcAddress)
    return data.aTokenAddress !== ZeroAddress
  }
}
