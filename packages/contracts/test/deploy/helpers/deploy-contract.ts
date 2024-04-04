import type { ContractName, HardhatRuntimeEnvironment } from 'hardhat/types'
import { type DeployResult } from '../../../hardhat/deployment/plugins/Deployer'

export async function deployContract(contractName: ContractName, args: unknown[], hre: HardhatRuntimeEnvironment): Promise<DeployResult> {
  return await hre.deploy(contractName, null, args)
}
