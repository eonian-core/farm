import { Vault__factory } from '../../../typechain-types'
import { DeploymentData } from '../../deployment/helpers/DeploymentData'
import { Chain, ContractGroup, TokenSymbol, resolveChain, resolveNetworkEnvironment } from '../../types'
import type { LookupMap } from './BaseProvider'
import { BaseProvider } from './BaseProvider'

export class EonianVaultProvider extends BaseProvider {
  protected async getLookupMap(): Promise<LookupMap> {
    const deploymentData = new DeploymentData(this.hre)
    const chain = resolveChain(this.hre)
    const networkEnvironment = resolveNetworkEnvironment(this.hre)
    const contractName = Vault__factory.contractName
    return {
      [chain]: {
        [networkEnvironment]: {
          [TokenSymbol.USDT]: await deploymentData.getProxyAddress(contractName, TokenSymbol.USDT),
          [TokenSymbol.USDC]: await deploymentData.getProxyAddress(contractName, TokenSymbol.USDC),
          [TokenSymbol.BUSD]: await deploymentData.getProxyAddress(contractName, TokenSymbol.BUSD),
          [TokenSymbol.BTCB]: await deploymentData.getProxyAddress(contractName, TokenSymbol.BTCB),
          [TokenSymbol.WETH]: await deploymentData.getProxyAddress(contractName, TokenSymbol.WETH),
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

  protected get name(): string {
    return ContractGroup.CHAINLINK_FEED
  }
}
