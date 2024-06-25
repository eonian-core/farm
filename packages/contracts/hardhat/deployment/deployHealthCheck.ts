import type { HardhatRuntimeEnvironment } from 'hardhat/types'
import type { LossRatioHealthCheck } from '../../typechain-types'
import { type DeployResult } from '@eonian/upgradeable'

export default async function deployHealthCheck(hre: HardhatRuntimeEnvironment): Promise<DeployResult> {
  const initializeArguments: Parameters<LossRatioHealthCheck['initialize']> = [
    500, // Parameter "shutdownLossRatio", N / 10_000
  ]
  return await hre.deploy('LossRatioHealthCheck', null, initializeArguments)
}
