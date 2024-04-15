import debug from 'debug'
import type { HardhatRuntimeEnvironment } from 'hardhat/types'
import _ from 'lodash'
import { Manifest } from '@openzeppelin/upgrades-core'
import type { DeployResult } from './Deployer'
import { DeployStatus } from './Deployer'

interface ProxyToValidate extends DeployResult {
  label: string
}

export class ProxyValidator {
  private log = debug(ProxyValidator.name)

  constructor(private hre: HardhatRuntimeEnvironment) {}

  public async validateLastDeployments() {
    this.log(`Starting "${this.validateLastDeployments.name}"...`)
    if (Object.keys(this.hre.lastDeployments).length === 0) {
      throw new Error('There is nothing to validate, no deployments were made during this session!')
    }
    await this.validateThatProxiesWereSaved()
    this.validateThatProxiesAreInSync()
  }

  /**
   * Checks that all deployed proxies exist in the register and OZ manifest files.
   */
  public async validateThatProxiesWereSaved() {
    this.log(`Starting "${this.validateThatProxiesWereSaved.name}"...`)
    const proxies = this.getProxyToValidate(DeployStatus.DEPLOYED)
    await this.validateThatProxiesWereSavedInRegister(proxies)
    await this.validateThatProxiesWereSavedInManifest(proxies)
  }

  /**
   * Checks that the specified proxies exist in the register file.
   */
  public async validateThatProxiesWereSavedInRegister(proxies: ProxyToValidate[]) {
    this.log(`Starting "${this.validateThatProxiesWereSavedInRegister.name}"...`)
    const registerRecords = await this.hre.proxyRegister.getAll()
    for (const proxy of proxies) {
      const proxyFromRegister = registerRecords.find(record => record.address === proxy.proxyAddress)
      if (!proxyFromRegister) {
        throw new Error(`Recently deployed proxy ${proxy.proxyAddress} (${proxy.label}) was not found in register!`)
      }
    }
  }

  /**
   * Checks that the specified proxies exist in the OZ manifest file.
   */
  public async validateThatProxiesWereSavedInManifest(proxies: ProxyToValidate[]) {
    this.log(`Starting "${this.validateThatProxiesWereSavedInManifest.name}"...`)
    const manifest = await Manifest.forNetwork(this.hre.ethers.provider)
    const manifestData = await manifest.read(3)
    for (const proxy of proxies) {
      const proxyFromManifest = manifestData.proxies.find(ozProxy => ozProxy.address === proxy.proxyAddress)
      if (!proxyFromManifest) {
        throw new Error(`Recently deployed proxy ${proxy.proxyAddress} (${proxy.label}) was not found in OZ manifest file!`)
      }
    }
  }

  /**
   * Checks that all deployed (or upgraded) proxies (from the same contract) have the same implementation.
   * This validation verifies that all proxies have been successfully upgraded.
   */
  public validateThatProxiesAreInSync() {
    this.log(`Starting "${this.validateThatProxiesAreInSync.name}"...`)
    const proxies = [...this.getProxyToValidate(DeployStatus.DEPLOYED), ...this.getProxyToValidate(DeployStatus.UPGRADED)]
    const groups = _.chain(proxies)
      .uniqBy(proxy => proxy.implementationAddress)
      .groupBy(proxy => proxy.contractName)
      .value()
    const contractNames = Object.keys(groups)
    for (const contractName of contractNames) {
      const proxies = groups[contractName]
      if (proxies.length > 1) {
        throw new Error(
          `Found ${proxies.length} different implementations for proxies of the same contract "${contractName}"! Proxies: ${JSON.stringify(proxies, null, 2)}`,
        )
      }
    }
  }

  private getProxyToValidate(deployStatus: DeployStatus): ProxyToValidate[] {
    return Object.values(this.hre.lastDeployments)
      .filter(deployment => deployment.status === deployStatus)
      .map(deployment => ({
        ...deployment,
        label: `${deployment.contractName} ${deployment.deploymentId ?? ''}`.trim(),
      }))
  }
}
