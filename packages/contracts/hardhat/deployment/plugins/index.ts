import { extendEnvironment } from 'hardhat/config'
import type { DeployFunction, DeployResult } from './Deployer'
import { Deployer } from './Deployer'
import { ProxyRegister } from './ProxyRegister'
import { ProxyValidator } from './ProxyValidator'
import { EtherscanVerifier } from './EtherscanVerifier'

export * from './Deployer'
export * from './ProxyRegister'
export { ProxyValidator } from './ProxyValidator'

declare module 'hardhat/types/runtime' {
  export interface HardhatRuntimeEnvironment {
    lastDeployments: Record<string, DeployResult>
    onBeforeDeploy?: (contractName: ContractName, deploymentId: string | null) => Promise<void> // For testing purposes
    deploy: DeployFunction
    etherscanVerifier: EtherscanVerifier
    proxyRegister: ProxyRegister
    proxyValidator: ProxyValidator
  }
}

extendEnvironment((hre) => {
  hre.lastDeployments = {}
  hre.deploy = Deployer.createDeployer(hre)
  hre.etherscanVerifier = new EtherscanVerifier(hre)
  hre.proxyRegister = new ProxyRegister(hre)
  hre.proxyValidator = new ProxyValidator(hre)
})
