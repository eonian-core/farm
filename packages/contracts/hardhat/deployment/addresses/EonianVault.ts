import { TokenSymbol, resolveChain, resolveNetworkEnvironment } from '../../types'
import type { LookupMap } from './BaseAddresses'
import { BaseAddresses } from './BaseAddresses'

export class EonianVault extends BaseAddresses {
  protected async getLookupMap(): Promise<LookupMap> {
    const chain = resolveChain(this.hre)
    const networkEnvironment = resolveNetworkEnvironment(this.hre)
    return {
      [chain]: {
        [networkEnvironment]: {
          [TokenSymbol.USDT]: await this.hre.proxyRegister.getProxyAddress('Vault', TokenSymbol.USDT),
          [TokenSymbol.USDC]: await this.hre.proxyRegister.getProxyAddress('Vault', TokenSymbol.USDC),
          [TokenSymbol.BUSD]: await this.hre.proxyRegister.getProxyAddress('Vault', TokenSymbol.BUSD),
          [TokenSymbol.BTCB]: await this.hre.proxyRegister.getProxyAddress('Vault', TokenSymbol.BTCB),
          [TokenSymbol.WETH]: await this.hre.proxyRegister.getProxyAddress('Vault', TokenSymbol.WETH),
        },
      },
    }
  }

  protected override async validateAddress(address: string, token: TokenSymbol | null): Promise<boolean> {
    const contract = await this.hre.ethers.getContractAt('Vault', address)
    const assetAddress = await contract.asset()
    const assetContract = await this.hre.ethers.getContractAt('IERC20Metadata', assetAddress)
    return await assetContract.symbol() === token
  }
}
