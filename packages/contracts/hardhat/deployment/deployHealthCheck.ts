import type { HardhatRuntimeEnvironment } from 'hardhat/types'
import type { LossRatioHealthCheck } from '../../typechain-types'
import { type DeployResult, Deployer } from './helpers/Deployer'

export default async function deployHealthCheck(hre: HardhatRuntimeEnvironment): Promise<DeployResult> {
  const initializeArguments: Parameters<LossRatioHealthCheck['initialize']> = [
    500, // Parameter "shutdownLossRatio", N / 10_000
  ]
  return await Deployer.performDeploy('LossRatioHealthCheck', null, initializeArguments, hre)
}
