import 'hardhat/types/runtime';

import { extendEnvironment } from 'hardhat/config'
import { DeployFunction, DeployResult, Deployer, EtherscanVerifier, ProxyRegister, ProxyValidator } from '../plugins';

declare module 'hardhat/types/runtime' {
    export interface HardhatRuntimeEnvironment {
      lastDeployments: Record<string, DeployResult>
      onBeforeDeploy?: (contractName: string, deploymentId: string | null) => Promise<void> // For testing purposes
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
  