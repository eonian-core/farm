import { Logger, ValidationProvider } from '@eonian/upgradeable'
import { task } from 'hardhat/config'
import type { HardhatRuntimeEnvironment } from 'hardhat/types'

async function action(taskArgs: Record<string, unknown>, hre: HardhatRuntimeEnvironment) {
  await hre.run('compile')

  const logger = new Logger(hre)
  const validationProvider = new ValidationProvider(hre, logger)

  const entries = await getDeploymentEntries(hre)
  for (const { contractName, proxy, implementation } of entries) {
    await validationProvider.validateImplementationInSyncWithRemote(proxy, implementation)
    await validationProvider.saveImplementationData(contractName, proxy)
  }
}

async function getDeploymentEntries(hre: HardhatRuntimeEnvironment) {
  const entries: Array<{ contractName: string; proxy: string; implementation: string }> = []

  const deployments = await hre.deployments.all()
  const deploymentNames = Object.keys(deployments)

  for (const deploymentName of deploymentNames) {
    const isSpecific = deploymentName.endsWith('_Implementation') || deploymentName.endsWith('_Proxy')
    if (isSpecific) {
      continue
    }

    const contractName = deploymentName.split('|')[0]
    const { address: proxy, implementation = '0x' } = await hre.deployments.get(deploymentName)
    entries.push({
      contractName,
      proxy,
      implementation,
    })
  }
  return entries
}

export const generateTask = task('generate-oz-manifest', 'Generates OpenZepellin manifest file (in ".openzepellin" folder)', action)
