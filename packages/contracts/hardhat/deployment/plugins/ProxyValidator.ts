import debug from 'debug'
import { extendEnvironment } from 'hardhat/config'
import type { HardhatRuntimeEnvironment } from 'hardhat/types'
import * as _ from 'lodash'
import { Manifest } from '@openzeppelin/upgrades-core'

declare module 'hardhat/types/runtime' {
  export interface HardhatRuntimeEnvironment {
    proxyValidator: ProxyValidator
  }
}

extendEnvironment((hre) => {
  hre.proxyValidator = new ProxyValidator(hre)
})

export class ProxyValidator {
  private log = debug(ProxyValidator.name)

  constructor(private hre: HardhatRuntimeEnvironment) {}

  public async validate() {
    await this.validateIfRegisterInSyncWithManifest()
    await this.validateForIntegrity()
  }

  /**
   * Checks that all proxies (from the register) exist in the OZ manifest file.
   */
  public async validateIfRegisterInSyncWithManifest() {
    this.log(`Executing "${this.validateIfRegisterInSyncWithManifest.name}"...`)
    const proxies = await this.hre.proxyRegister.getAll()
    const manifest = await Manifest.forNetwork(this.hre.ethers.provider)
    const manifestData = await manifest.read(3)
    const messages: string[] = []
    for (const proxy of proxies) {
      const manifestProxy = manifestData.proxies.find(manifestProxy => manifestProxy.address === proxy.address)
      if (!manifestProxy) {
        messages.push(`Proxy "${proxy.address}" (${proxy.contractName}, id: ${proxy.id}) is not found in OZ manifest!`)
      }
    }
    if (messages.length > 0) {
      throw new Error(`[${this.validateIfRegisterInSyncWithManifest.name}]: \n\t${messages.join('\n\t')}`)
    }
  }

  /**
   * Checks that all existing proxies (from the same contract) have the same implementation.
   * This validation verifies that all proxies have been successfully upgraded.
   */
  public async validateForIntegrity() {
    this.log(`Executing "${this.validateForIntegrity.name}"...`)
    const proxies = await this.hre.proxyRegister.getAll()
    const groups = _.chain(proxies)
      .uniqBy(proxy => proxy.implementationAddress)
      .groupBy(proxy => proxy.contractName)
      .value()
    const contractNames = Object.keys(groups)
    for (const contractName of contractNames) {
      const proxies = groups[contractName]
      if (proxies.length > 1) {
        throw new Error(
          `[${this.validateForIntegrity.name}]: Found ${proxies.length} different implementations for proxies of the same contract "${contractName}"! Proxies: ${JSON.stringify(proxies, null, 2)}`,
        )
      }
    }
  }
}
