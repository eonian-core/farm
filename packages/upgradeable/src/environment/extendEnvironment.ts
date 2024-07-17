import 'hardhat/types/runtime';

import { extendEnvironment } from 'hardhat/config'
import { Context, DeployResult, Deployer, EtherscanVerifierAdapter, ProxyRegister, ProxyValidator } from '../plugins';
import { SafeProxyCiService, needUseSafe } from '../plugins/SafeProxyCiService';
import { HardhatRuntimeEnvironment } from 'hardhat/types/runtime';
import { UpgradeOptions } from '@openzeppelin/hardhat-upgrades';
import { ProxyCiService } from '../plugins/ProxyCiService';
import { ProxyVerifier } from '../plugins/ProxyVerifier';
import { ImplementationService } from '../plugins/ImplementationService';

export const deploy = (hre: HardhatRuntimeEnvironment) => async (
  contractName: string,
  deploymentId: string | null,
  initArgs: unknown[],
  upgradeOptions?: UpgradeOptions
): Promise<DeployResult> => {
  const ctx = new Context(hre, contractName, deploymentId)
  const etherscan = new EtherscanVerifierAdapter(hre)

  const proxy = needUseSafe() 
    ? await SafeProxyCiService.initSafe(ctx, initArgs, etherscan, upgradeOptions) 
    : await ProxyCiService.init(ctx, initArgs, upgradeOptions);

  const verifier = new ProxyVerifier(ctx, proxy, etherscan)
  const impl = new ImplementationService(ctx, proxy)
  const deployer = new Deployer(ctx, proxy, impl, verifier)

  return await deployer.deploy()
}

declare module 'hardhat/types/runtime' {
    export interface HardhatRuntimeEnvironment {
      lastDeployments: Record<string, DeployResult>
      onBeforeDeploy?: (contractName: string, deploymentId: string | null) => Promise<void> // For testing purposes
      deploy: ReturnType<typeof deploy>
      proxyRegister: ProxyRegister
      proxyValidator: ProxyValidator
    }
  }
  
  extendEnvironment((hre) => {
    hre.lastDeployments = {}
    hre.deploy = deploy(hre)
    hre.proxyRegister = new ProxyRegister(hre)
    hre.proxyValidator = new ProxyValidator(hre)
  })
  