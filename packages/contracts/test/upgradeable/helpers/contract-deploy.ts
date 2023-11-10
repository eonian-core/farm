import type { HardhatRuntimeEnvironment } from 'hardhat/types'
import type { DeployResult } from 'hardhat-deploy/types'
import type { DeployArgs } from '@eonian/upgradeable'
import type { StubOptions } from './generate-stub-deployment'
import { generateStubDeployment } from './generate-stub-deployment'

type DeployContractResult = DeployResult & DeployArgs & { wasUpgraded: boolean }

export async function deployContract(contract: string, options: StubOptions, hre: HardhatRuntimeEnvironment): Promise<DeployContractResult> {
  let deployResult!: DeployResult
  let deployArgs!: DeployArgs
  let wasUpgraded!: boolean
  await generateStubDeployment({
    contract,
    options,
    onDeployResult: (result, args, isUpgrade) => {
      deployResult = result
      deployArgs = args
      wasUpgraded = isUpgrade
    },
  })(hre)
  return { ...deployResult, ...deployArgs, wasUpgraded }
}
