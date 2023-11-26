import { DeployErrorHandler } from '@eonian/upgradeable'
import { TASK_DEPLOY } from 'hardhat-deploy'
import { task } from 'hardhat/config'

const taskName = 'check-past-deployment-result'

/**
 * Creates the error holder file before the deploy.
 */
task(TASK_DEPLOY, async (_args, hre, runSuper) => {
  if (hre.network.name === 'hardhat' && !process.env.TEST_DEPLOY) {
    return runSuper(_args)
  }

  const deployErrorHandler = new DeployErrorHandler(hre)
  await deployErrorHandler.createErrorManifestFile()

  return runSuper(_args)
})

/**
 * Checks if the error file is empty.
 * If not, will throw the error. Used in CI.
 */
export const checkPastDeploymentResult = task(taskName, async (_args, hre) => {
  const deployErrorHandler = new DeployErrorHandler(hre)
  await deployErrorHandler.checkDeployResult()

  console.log(`[${taskName}] Deployment was succesful`)
})
