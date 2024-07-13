import debug from 'debug'
import type { HardhatRuntimeEnvironment } from 'hardhat/types'
import { Manifest } from '@openzeppelin/upgrades-core'
import type { UpgradeOptions } from '@openzeppelin/hardhat-upgrades/dist/utils'
import type { ContractFactory } from 'ethers'
import { DeployState, DeployStatus } from './DeployState'
import { BaseDeployer } from './BaseDeployer'

export interface DeployResult {
  contractName: string
  deploymentId: string | null
  proxyAddress: string
  implementationAddress?: string
  status: DeployStatus
  verified?: boolean
}

export class Deployer extends BaseDeployer {
  constructor(
    hre: HardhatRuntimeEnvironment,
    contractName: string,
    deploymentId: string | null,
    private initArgs: unknown[],
    private upgradeOptions: UpgradeOptions = { constructorArgs: [true] }, // Disable initializers
  ) {
    super(debug(Deployer.name), hre, contractName, deploymentId)
    this.upgradeOptions = {
      kind: 'uups',
      redeployImplementation: 'onchange',
      ...this.upgradeOptions,
    }
  }

  /**
   * Performs deployment and upgrade for the specified contract only if required.
   * Deployment will only be performed if the specified deployment ID is not found in the deployment data (@see DeploymentData).
   * Upgrade will only be executed if the contract bytecode has been changed.
   * Otherwise, no actual transactions will be executed.
   * @returns The result of the deploy (@see DeployResult).
   */
  public async deploy(): Promise<DeployResult> {
    await this.executePreDeployHook()

    // Returns the proxy address from the cache (deployment data file) or deploys a new proxy first.
    const proxyAddress = (await this.findProxyInCache()) ?? await this.deployProxy();
    this.log(`Proxy retrived: ${proxyAddress}`)

    const oldImplAddress = await this.getImplementation(proxyAddress)
    const newImplAddress = await this.deployImplementationIfNeeded(proxyAddress)
    this.log(`New implementation retrived: ${newImplAddress}`)

    const sameImplementationCode = await this.haveSameBytecode(oldImplAddress, newImplAddress)
    if (!sameImplementationCode) {
      this.log(`Implementation changed:\n new:${newImplAddress}\nold:${oldImplAddress}`)
      await this.upgradeProxy(proxyAddress)
    } else {
      this.log('Implementation has not been changed...')
    }

    const verified = await this.hre.etherscanVerifier.verifyIfNeeded(proxyAddress, this.upgradeOptions.constructorArgs)
    if (verified) {
      this.log(`Contract ${proxyAddress} have been verified on etherscan!`)
    } 

    return (this.hre.lastDeployments[proxyAddress] = {
      proxyAddress,
      implementationAddress: newImplAddress,
      contractName: this.contractName,
      deploymentId: this.deploymentId,
      status: this.state.status,
      verified,
    })
  }

  /**
   * Deploys a new proxy and implementation contract. Saves the proxy address to the deployment data file.
   * @returns The address of the proxy contract.
   */
  private async deployProxy(): Promise<string> {
    this.log('Starting proxy deployment...')
    
    const contract = await this.hre.upgrades.deployProxy(await this.getContractFactory(), this.initArgs, this.upgradeOptions)
    await contract.waitForDeployment()
    const address = await contract.getAddress()
    this.log(`Succesfully deployed proxy to "${address}"`)

    await this.hre.proxyRegister.saveProxy(this.contractName, this.deploymentId, address)
    this.log(`Proxy with address "${address}" saved to the deployment data file...`)

    this.state.switchTo(DeployStatus.DEPLOYED)

    return address
  }

  /**
   * Validates and upgrades the specified proxy.
   * @param proxyAddress The address of the proxy to upgrade.
   */
  private async upgradeProxy(proxyAddress: string): Promise<void> {
    this.log(`Going to upgrade proxy "${proxyAddress}"...`)
    await this.hre.upgrades.upgradeProxy(proxyAddress, await this.getContractFactory(), this.upgradeOptions)

    this.state.switchTo(DeployStatus.UPGRADED)
    this.log(`Proxy "${proxyAddress}" has been upgraded...`)
  }

  /**
   * Validates the implementation contract and deploys it if required (if the byte code has been changed).
   * (!) This function doesn't set the implementation address of the proxy.
   * @param proxyAddress The proxy address to get the current implementation from.
   * @returns Implementation address. Returns the current implementation of the proxy if no deployment has been made.
   */
  private async deployImplementationIfNeeded(proxyAddress: string): Promise<string> {
    this.log('Checking and deploy new implementation if needed...')
    const contractFactory = await this.getContractFactory()
    const response = await this.hre.upgrades.prepareUpgrade(proxyAddress, contractFactory, this.upgradeOptions)
    if (typeof response !== 'string') {
      throw new TypeError(`Expected "string" address, but got ${JSON.stringify(response)}`)
    }
    return response
  }

  private async haveSameBytecode(implementationA: string, implementationB: string): Promise<boolean> {
    this.log(`Checking if implementation has been changed...\nnew:${implementationA}\nold:${implementationB}`)
    if (implementationA === implementationB) {
      return true
    }
    const manifest = await Manifest.forNetwork(this.hre.ethers.provider)
    const data = await manifest.read(3)
    const implementations = Object.values(data.impls)
    return implementations.some((implementationData) => {
      const addresses = [implementationData!.address, ...(implementationData!.allAddresses ?? [])]
      return addresses.includes(implementationA) && addresses.includes(implementationB)
    })
  }

}
