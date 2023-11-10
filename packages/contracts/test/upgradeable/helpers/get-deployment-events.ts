import type { DeployResult } from 'hardhat-deploy/types'
import type { HardhatRuntimeEnvironment } from 'hardhat/types'

export async function getDeploymentEvents(deployResult: DeployResult, eventName: string, hre: HardhatRuntimeEnvironment) {
  const [singer] = await hre.ethers.getSigners()
  const contract = new hre.ethers.Contract(
    deployResult.address,
    deployResult.abi,
    singer,
  )
  const eventFilter = contract.filters[eventName]()
  const block = await hre.ethers.provider.getBlock('latest')

  // Specify lookup page size to prevent "limit exceeded" error.
  // 7 blocks is the maximum value that the BSC endpoint allows you to look past,
  // but it's enough to get recent events from deployment.
  const step = 7

  const blockNumber = block.number
  return await contract.queryFilter(eventFilter, blockNumber - step, blockNumber)
}
