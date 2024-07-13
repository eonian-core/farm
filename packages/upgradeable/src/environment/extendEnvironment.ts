import 'hardhat/types/runtime';

import { extendEnvironment } from 'hardhat/config'
import { DeployResult, Deployer, EtherscanVerifier, ProxyRegister, ProxyValidator } from '../plugins';
import { DefenderDeployer, needUseDefender } from '../plugins/DefenderDeployer';

type Tail<T extends any[]> = T extends [infer _A, ...infer R] ? R : never
export type DeployFunction = (...args: Tail<ConstructorParameters<typeof Deployer>>) => Promise<DeployResult>

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
    hre.deploy =  (...args: Parameters<DeployFunction>) => {
      if(needUseDefender()) {
        return new DefenderDeployer(hre, ...args).deploy()
      }

      return new Deployer(hre, ...args).deploy()
    }
    
    hre.etherscanVerifier = new EtherscanVerifier(hre)
    hre.proxyRegister = new ProxyRegister(hre)
    hre.proxyValidator = new ProxyValidator(hre)
  })
  