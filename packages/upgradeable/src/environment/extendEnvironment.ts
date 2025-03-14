import 'hardhat/types/runtime';

import { extendEnvironment } from 'hardhat/config'
import { DeployResult, ProxyRegister, ProxyValidator } from '../plugins';
import { deploy } from './deploy';
import { proposeSafeTransaction } from './proposeSafeTransaction';
import { proposeOrSendTx } from './proposeOrSendTx';
declare module 'hardhat/types/runtime' {
    export interface HardhatRuntimeEnvironment {
      lastDeployments: Record<string, DeployResult>
      onBeforeDeploy?: (contractName: string, deploymentId: string | null) => Promise<void> // For testing purposes
      deploy: ReturnType<typeof deploy>
      proposeSafeTransaction: ReturnType<typeof proposeSafeTransaction>
      proposeOrSendTx: ReturnType<typeof proposeOrSendTx>
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
    hre.proposeOrSendTx = proposeOrSendTx(hre)
  })
  