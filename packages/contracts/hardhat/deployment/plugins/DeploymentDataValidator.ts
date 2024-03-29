import type { ManifestData } from '@openzeppelin/upgrades-core'
import { Manifest } from '@openzeppelin/upgrades-core'
import { difference } from 'lodash'
import type { HardhatRuntimeEnvironment } from 'hardhat/types'
import type { DeploymentFile } from './DeploymentRegister'

export class DeploymentDataValidator {
  constructor(private hre: HardhatRuntimeEnvironment) {}

  /**
   * Validates the deployment data.
   */
  public async validate(data: DeploymentFile): Promise<void> {
    await this.validateSyncWithManifest(data)
  }

  /**
   * Validates that the data is match with OZ manifest file.
   * I.e. every proxy from manifest are present in the deployment file.
   * @param data The data to validate.
   */
  private async validateSyncWithManifest(data: DeploymentFile): Promise<void> {
    const proxies = Object.values(data).map(contract => Object.values(contract.proxies)).flat()
    const manifestData = await this.getManifestData()
    const ozProxies = manifestData.proxies.map(proxy => proxy.address)
    const missingProxies = difference(ozProxies, proxies)
    const printArray = (array: string[]) => `[${array.join(', ')}]`
    if (missingProxies.length > 0) {
      throw new Error(
        `Found ${missingProxies.length} missing proxies in deployment data: ${printArray(missingProxies)}. Manifest has: ${printArray(ozProxies)}, but got: ${printArray(proxies)}`,
      )
    }
    const extraProxies = difference(proxies, ozProxies)
    if (extraProxies.length > 0) {
      throw new Error(
        `Found ${extraProxies.length} extra proxies in deployment data: ${printArray(extraProxies)}. Manifest has: ${printArray(ozProxies)}, but got: ${printArray(proxies)}`,
      )
    }
  }

  /**
   * Reads the OpenZeppelin's manifest file and returns its content.
   */
  public async getManifestData(): Promise<ManifestData> {
    const manifest = await this.getOpenZeppelinManifest()
    const manifestData = await manifest.read(3)
    return manifestData
  }

  /**
   * Returns active OZ manifest.
   */
  public async getOpenZeppelinManifest() {
    return await Manifest.forNetwork(this.hre.ethers.provider)
  }
}
