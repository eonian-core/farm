import { promises } from 'node:fs'
import type { HardhatRuntimeEnvironment } from 'hardhat/types'
import _ from 'lodash'
import type { Manifest } from '@openzeppelin/upgrades-core'
import { DeploymentData } from '../../../hardhat/deployment/helpers/DeploymentData'

/**
 * Testing hooks which are needed to clear deployments data between tests
 */
export function clearDeployments(hre: HardhatRuntimeEnvironment) {
  let manifest!: Manifest

  const deploymentData = new DeploymentData(hre)

  beforeEach(async () => {
    manifest = await deploymentData.validator.getOpenZeppelinManifest()
    await manifest.lockedRun(async () => {
      await manifest.write({
        manifestVersion: '3.2',
        impls: {},
        proxies: [],
      })
    })
  })

  /**
   * Clears ".json" deployments data between each test
   */
  afterEach(async () => {
    await deploymentData.deleteFile()
    await deleteOZManifestFile()
  })

  async function deleteOZManifestFile(): Promise<void> {
    await manifest.lockedRun(async () => {
      await promises.unlink(manifest.file)
    })
  }

  return { deleteOZManifestFile }
}
