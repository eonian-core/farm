import type { HardhatRuntimeEnvironment } from 'hardhat/types'
import { type DeployResult } from '../plugins/Deployer'

export async function deployContract(
  contractName: string, 
  args: unknown[],
  hre: HardhatRuntimeEnvironment, 
  id: string | null = null): Promise<DeployResult> {
  return await hre.deploy(contractName, id, args)
}
