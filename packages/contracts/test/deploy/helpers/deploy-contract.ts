import type { ContractName, HardhatRuntimeEnvironment } from 'hardhat/types'
import { type DeployResult } from '../../../hardhat/deployment/plugins/Deployer'

export async function deployContract(contractName: ContractName, args: unknown[], hre: HardhatRuntimeEnvironment, id: string | null = null): Promise<DeployResult> {
  return await hre.deploy(contractName, id, args)
}
