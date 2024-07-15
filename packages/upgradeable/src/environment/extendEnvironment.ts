import 'hardhat/types/runtime';

import { extendEnvironment } from 'hardhat/config'
import { Context, DeployResult, Deployer, EtherscanVerifierAdapter, ProxyRegister, ProxyValidator } from '../plugins';
import { SafeProxyCiService, needUseSafe } from '../plugins/SafeProxyCiService';
import { HardhatRuntimeEnvironment } from 'hardhat/types/runtime';
import { UpgradeOptions } from '@openzeppelin/hardhat-upgrades';
import { ProxyCiService } from '../plugins/ProxyCiService';
import { ProxyVerifier } from '../plugins/ProxyVerifier';
import { ImplementationService } from '../plugins/ImplementationService';

type Tail<T extends any[]> = T extends [infer _A, ...infer R] ? R : never
export type DeployFunction = (        
  hre: HardhatRuntimeEnvironment,
  contractName: string,
  deploymentId: string | null,
  initArgs: unknown[],
  upgradeOptions: UpgradeOptions
) => Promise<DeployResult>

declare module 'hardhat/types/runtime' {
    export interface HardhatRuntimeEnvironment {
      lastDeployments: Record<string, DeployResult>
      onBeforeDeploy?: (contractName: string, deploymentId: string | null) => Promise<void> // For testing purposes
      deploy: DeployFunction
      proxyRegister: ProxyRegister
      proxyValidator: ProxyValidator
    }
  }
  
  extendEnvironment((hre) => {
    hre.lastDeployments = {}
    hre.deploy = async (hre,contractName, deploymentId, initArgs, upgradeOptions) => {
      const ctx = new Context(hre, contractName, deploymentId)
      
      const proxy = await ProxyCiService.init(ctx, initArgs, upgradeOptions)
      const etherscan = new EtherscanVerifierAdapter(hre)
      const verifier = new ProxyVerifier(ctx, proxy, etherscan)
      const impl = new ImplementationService(ctx, proxy)

      const proxyCiService = needUseSafe() 
        ? await SafeProxyCiService.initSafe(ctx, initArgs, upgradeOptions, verifier) 
        : proxy;
      const deployer = new Deployer(ctx, proxyCiService, impl, verifier)

      return await deployer.deploy()
    }
    
    hre.proxyRegister = new ProxyRegister(hre)
    hre.proxyValidator = new ProxyValidator(hre)
  })
  