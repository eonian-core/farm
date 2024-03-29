import debug from 'debug'
import type { HardhatRuntimeEnvironment } from 'hardhat/types'
import type { UpgradeOptions } from '@openzeppelin/hardhat-upgrades/dist/utils'
import type { ContractFactory } from 'ethers'
import { extendEnvironment } from 'hardhat/config'

export enum DeployStatus {
  DEPLOYED = 'DEPLOYED',
  UPGRADED = 'UPGRADED',
  NONE = 'NONE',
}

export interface DeployResult {
  proxyAddress: string
  implementationAddress: string
  status: DeployStatus
}

type Tail<T extends any[]> = T extends [infer _A, ...infer R] ? R : never
type DeployFunction = (...args: Tail<ConstructorParameters<typeof Deployer>>) => Promise<DeployResult>

declare module 'hardhat/types/runtime' {
  export interface HardhatRuntimeEnvironment {
    deploy: DeployFunction
  }
}

extendEnvironment((hre) => {
  hre.deploy = Deployer.createDeployer(hre)
})

class Deployer {
  private logger: debug.Debugger = debug(Deployer.name)

  private contractFactory: ContractFactory | null = null
  private deployStatus: DeployStatus = DeployStatus.NONE

  constructor(
    private hre: HardhatRuntimeEnvironment,
    private contractName: string,
    private deploymentId: string | null,
    private initArgs: unknown[],
    private upgradeOptions: UpgradeOptions = { constructorArgs: [true] }, // Disable initializers
  ) {
    this.upgradeOptions = {
      kind: 'uups',
      redeployImplementation: 'onchange',
      ...this.upgradeOptions,
    }
  }

  public static createDeployer = (hre: HardhatRuntimeEnvironment): DeployFunction => {
    return (...args: Parameters<DeployFunction>) => new Deployer(hre, ...args).deploy()
  }

  /**
   * Performs deployment and upgrade for the specified contract only if required.
   * Deployment will only be performed if the specified deployment ID is not found in the deployment data (@see DeploymentData).
   * Upgrade will only be executed if the contract bytecode has been changed.
   * Otherwise, no actual transactions will be executed.
   * @returns The result of the deploy (@see DeployResult).
   */
  public async deploy(): Promise<DeployResult> {
    const proxyAddress = await this.getOrCreateProxy()

    const proxyImplementationAddress = await this.getImplementation(proxyAddress)
    const implementationAddress = await this.deployImplementationIfNeeded(proxyAddress)

    if (proxyImplementationAddress !== implementationAddress) {
      this.log(`Implementation changed: ${implementationAddress} (new) != ${proxyImplementationAddress} (old)!`)
      await this.upgradeProxy(proxyAddress)
    }

    return {
      proxyAddress,
      implementationAddress,
      status: this.deployStatus,
    }
  }

  /**
   * Returns the proxy address from the cache (deployment data file) or deploys a new proxy first.
   */
  private async getOrCreateProxy(): Promise<string> {
    const proxyAddressFromCache = await this.hre.deploymentRegister.getProxyAddress(this.contractName, this.deploymentId)
    if (proxyAddressFromCache) {
      this.log(`Proxy address "${proxyAddressFromCache} was found in the deployment file (deploy is skipped)`)
      return proxyAddressFromCache
    }
    return await this.deployProxy()
  }

  /**
   * Deploys a new proxy and implementation contract. Saves the proxy address to the deployment data file.
   * @returns The address of the proxy contract.
   */
  private async deployProxy(): Promise<string> {
    this.log('Starting proxy deployment...')
    const contract = await this.hre.upgrades.deployProxy(await this.getContractFactory(), this.initArgs, this.upgradeOptions)
    const address = await contract.getAddress()

    this.log(`Saving proxy address "${address}" to the deployment data file...`)
    await this.hre.deploymentRegister.saveProxy(this.contractName, this.deploymentId, address)

    this.changeDeployStatus(DeployStatus.DEPLOYED)

    return address
  }

  /**
   * Validates and upgrades the specified proxy.
   * @param proxyAddress The address of the proxy to upgrade.
   */
  private async upgradeProxy(proxyAddress: string): Promise<void> {
    this.log(`Going to upgrade proxy "${proxyAddress}"...`)
    await this.hre.upgrades.upgradeProxy(proxyAddress, await this.getContractFactory(), this.upgradeOptions)

    this.changeDeployStatus(DeployStatus.UPGRADED)
  }

  /**
   * Validates the implementation contract and deploys it if required (if the byte code has been changed).
   * (!) This function doesn't set the implementation address of the proxy.
   * @param proxyAddress The proxy address to get the current implementation from.
   * @returns Implementation address. Returns the current implementation of the proxy if no deployment has been made.
   */
  private async deployImplementationIfNeeded(proxyAddress: string): Promise<string> {
    const contractFactory = await this.hre.ethers.getContractFactory(this.contractName)
    const response = await this.hre.upgrades.prepareUpgrade(proxyAddress, contractFactory, this.upgradeOptions)
    if (typeof response !== 'string') {
      throw new TypeError(`Expected "string" address, but got ${JSON.stringify(response)}`)
    }
    return response
  }

  /**
   * Returns the address of the current proxy implementation.
   * @param proxyAddress The address of the proxy.
   * @returns The implementation address.
   */
  private async getImplementation(proxyAddress: string): Promise<string> {
    return await this.hre.upgrades.erc1967.getImplementationAddress(proxyAddress)
  }

  /**
   * Returns the contract factory.
   */
  private async getContractFactory(): Promise<ContractFactory> {
    return this.contractFactory ??= await this.hre.ethers.getContractFactory(this.contractName)
  }

  /**
   * Changes and validates the current deployment status.
   */
  private changeDeployStatus(newStatus: DeployStatus) {
    const allowedTransitions: Record<DeployStatus, DeployStatus[]> = {
      [DeployStatus.DEPLOYED]: [DeployStatus.NONE],
      [DeployStatus.UPGRADED]: [DeployStatus.NONE, DeployStatus.DEPLOYED],
      [DeployStatus.NONE]: [],
    }
    if (!allowedTransitions[newStatus].includes(this.deployStatus)) {
      throw new Error(`Illegal deploy status transition (new: ${newStatus}, current: ${this.deployStatus})!`)
    }
    this.deployStatus = newStatus
  }

  private log(message: string) {
    this.logger(`[${this.contractName}.${this.deploymentId}] - ${message}`)
  }
}
