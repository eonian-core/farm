import 'hardhat/types/runtime';

import { extendEnvironment } from 'hardhat/config'
import { Context, DeployResult, Deployer, EtherscanVerifierAdapter, ProxyRegister, ProxyValidator } from '../plugins';
import { SafeProxyCiService, needUseSafe } from '../plugins/SafeProxyCiService';
import { HardhatRuntimeEnvironment } from 'hardhat/types/runtime';
import { UpgradeOptions } from '@openzeppelin/hardhat-upgrades';
import { ProxyCiService } from '../plugins/ProxyCiService';
import { ProxyVerifier } from '../plugins/ProxyVerifier';
import { ImplementationService } from '../plugins/ImplementationService';
import { SafeAdapter } from '../plugins/SafeAdapter';
import { BaseContract, Contract, FunctionFragment, Signer } from 'ethers';
import { getSigner } from '@openzeppelin/hardhat-upgrades/dist/utils';

export const deploy = (hre: HardhatRuntimeEnvironment) => async (
  contractName: string,
  deploymentId: string | null,
  initArgs: unknown[],
  upgradeOptions?: UpgradeOptions
): Promise<DeployResult> => {
  const ctx = new Context(hre, contractName, deploymentId)
  const etherscan = new EtherscanVerifierAdapter(hre)

  let proxy = await ProxyCiService.init(ctx, initArgs, upgradeOptions);
  if(needUseSafe()) {
    const safe = new SafeAdapter(ctx)
    proxy = await SafeProxyCiService.initSafe(ctx, initArgs, etherscan, safe, upgradeOptions) 
  }

  const verifier = new ProxyVerifier(ctx, proxy, etherscan)
  const impl = new ImplementationService(ctx, proxy)
  const deployer = new Deployer(ctx, proxy, impl, verifier)

  return await deployer.deploy()
}

export interface SafeTransactionOptions {
  /** Source contract deployment that trigger transaction */
  sourceContractName: string,
  deploymentId: string | null,
  /** Address of target contract */
  address: string, 
  /** Instance of target contract */
  contract: BaseContract, 
  /** Function fragment or name of function to trigger */
  functionName: FunctionFragment | string, 
  /** Arguments for function */
  args: ReadonlyArray<any>, 
  /** Signer for transaction, if not provided will be used current source deployment contract signer */
  signer?: Signer
}

export const proposeSafeTransaction = (hre: HardhatRuntimeEnvironment) => async ({
  sourceContractName, 
  deploymentId,
  signer,
  address,
  contract,
  functionName,
  args
}: SafeTransactionOptions) => {
  const ctx = new Context(hre, sourceContractName, deploymentId)
  const safe = new SafeAdapter(ctx)

  const contractFactory = await hre.ethers.getContractFactory(sourceContractName)
  signer = signer ?? getSigner(contractFactory.runner)
  if(!signer) 
    throw new Error(`Signer for contract "${sourceContractName}" is not defined`)

  return await safe.proposeTransaction(address, contract, functionName, args, signer)
}

declare module 'hardhat/types/runtime' {
    export interface HardhatRuntimeEnvironment {
      lastDeployments: Record<string, DeployResult>
      onBeforeDeploy?: (contractName: string, deploymentId: string | null) => Promise<void> // For testing purposes
      deploy: ReturnType<typeof deploy>
      proposeSafeTransaction: ReturnType<typeof proposeSafeTransaction>
      proxyRegister: ProxyRegister
      proxyValidator: ProxyValidator
    }
  }
  
  extendEnvironment((hre) => {
    hre.lastDeployments = {}
    hre.deploy = deploy(hre)
    hre.proxyRegister = new ProxyRegister(hre)
    hre.proxyValidator = new ProxyValidator(hre)
    hre.proposeSafeTransaction = proposeSafeTransaction(hre)
  })
  