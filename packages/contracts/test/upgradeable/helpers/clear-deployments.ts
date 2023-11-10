import { promises } from 'node:fs'
import path from 'node:path'
import type { HardhatRuntimeEnvironment } from 'hardhat/types'
import _ from 'lodash'
import { Manifest } from '@openzeppelin/upgrades-core'

/**
 * Testing hooks which are needed to clear deployments data between tests
 */
export function clearDeployments(hre: HardhatRuntimeEnvironment) {
  let existingDeployments: string[] = []

  beforeEach(async () => {
    existingDeployments = await getDeployments()
  })

  /**
   * Clears ".json" deployments data between each test
   */
  afterEach(async () => {
    const currentDeployments = await getDeployments()
    const newDeployments = _.difference(currentDeployments, existingDeployments)
    for (const name of newDeployments) {
      await hre.deployments.delete(name)
      await hre.deployments.deleteDotFile(name)
    }

    await deleteOZManifestFile()
  })

  /**
   * Removes "hardhat" deployments folder (if empty)
   */
  after(async () => {
    try {
      const { deployments } = hre.config.paths
      const deploymentsPath = path.join(deployments, hre.deployments.getNetworkName())
      const files = await promises.readdir(deploymentsPath)
      for (const file of files) {
        if (file.endsWith('.json')) {
          console.warn(`Directory "${deploymentsPath}" contains deployments data, remove it manually`)
          return
        }
      }
      await promises.rm(deploymentsPath, { recursive: true, force: true })
    }
    catch (e) {
      if (e instanceof Error) {
        console.error(`[clearDeployments.after] ${e.message}`)
      }
    }
  })

  async function getDeployments(): Promise<string[]> {
    const deployments = await hre.deployments.all()
    return Object.keys(deployments)
  }

  async function deleteOZManifestFile(): Promise<void> {
    const manifest = await Manifest.forNetwork(hre.ethers.provider)
    await manifest.lockedRun(async () => {
      return promises.unlink(manifest.file)
    })
  }

  return { deleteOZManifestFile }
}
