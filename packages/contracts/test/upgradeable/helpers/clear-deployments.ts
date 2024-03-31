import { promises } from 'node:fs'
import type { HardhatRuntimeEnvironment } from 'hardhat/types'
import _ from 'lodash'
import { Manifest } from '@openzeppelin/upgrades-core'

/**
 * Testing hooks which are needed to clear deployments data between tests
 */
export function clearDeployments(hre: HardhatRuntimeEnvironment) {
  let manifest!: Manifest

  beforeEach(async () => {
    manifest ??= await Manifest.forNetwork(hre.ethers.provider)
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
    await hre.proxyRegister.deleteFile()
    await deleteOZManifestFile()
  })

  async function deleteOZManifestFile(): Promise<void> {
    await manifest.lockedRun(async () => {
      await promises.unlink(manifest.file)
    })
  }

  return { deleteOZManifestFile }
}
