import type { HardhatRuntimeEnvironment } from 'hardhat/types'
import { type DeployResult, Deployer } from '../../../hardhat/deployment/helpers/Deployer'

export async function deployContract(contractName: string, args: unknown[], hre: HardhatRuntimeEnvironment): Promise<DeployResult> {
  return await Deployer.performDeploy(contractName, null, args, hre)
}
