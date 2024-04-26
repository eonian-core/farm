import debug from 'debug'
import type { ContractName, HardhatRuntimeEnvironment } from 'hardhat/types'
import { Manifest } from '@openzeppelin/upgrades-core'
import type { UpgradeOptions } from '@openzeppelin/hardhat-upgrades/dist/utils'
import type { ContractFactory } from 'ethers'
import { NetworkEnvironment, resolveNetworkEnvironment } from '../../types'

export enum DeployStatus {
  DEPLOYED = 'DEPLOYED',
  UPGRADED = 'UPGRADED',
  NONE = 'NONE',
}

export interface DeployResult {
  contractName: string
  deploymentId: string | null
  proxyAddress: string
  implementationAddress: string
  status: DeployStatus
  verified: boolean
}

type Tail<T extends any[]> = T extends [infer _A, ...infer R] ? R : never
export type DeployFunction = (...args: Tail<ConstructorParameters<typeof Deployer>>) => Promise<DeployResult>

export class Deployer {
  private logger: debug.Debugger = debug(Deployer.name)

  private contractFactory: ContractFactory | null = null
  private deployStatus: DeployStatus = DeployStatus.NONE

  constructor(
    private hre: HardhatRuntimeEnvironment,
    private contractName: ContractName,
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
    await this.executePreDeployHook()

    const proxyAddress = await this.getOrCreateProxy()

    const proxyImplementationAddress = await this.getImplementation(proxyAddress)
    const implementationAddress = await this.deployImplementationIfNeeded(proxyAddress)

    const sameImplementationCode = await this.haveSameBytecode(proxyImplementationAddress, implementationAddress)
    if (!sameImplementationCode) {
      this.log(`Implementation changed: ${implementationAddress} (new) != ${proxyImplementationAddress} (old)!`)
      await this.upgradeProxy(proxyAddress)
    }

    const successfullyVerified = await this.verifyIfNeeded(proxyAddress)

    return (this.hre.lastDeployments[proxyAddress] = {
      proxyAddress,
      implementationAddress,
      contractName: this.contractName,
      deploymentId: this.deploymentId,
      status: this.deployStatus,
      verified: successfullyVerified,
    })
  }

  private async executePreDeployHook(): Promise<void> {
    const onBeforeDeploy = this.hre.onBeforeDeploy
    if (onBeforeDeploy) {
      await onBeforeDeploy(this.contractName, this.deploymentId)
    }
  }

  private async verifyIfNeeded(proxyAddress: string): Promise<boolean> {
    if (this.deployStatus === DeployStatus.NONE) {
      this.log('No need to verify, the proxy was not upgraded!')
      return false
    }

    const networkEnvironment = resolveNetworkEnvironment(this.hre)
    if (networkEnvironment === NetworkEnvironment.LOCAL) {
      this.log(`Verification is disabled on "${networkEnvironment}" environment!`)
      return false
    }

    this.log('Starting to verify deployed (or upgraded) contracts...')
    try {
      await this.interceptOutput(this.verifyIfNeeded.name, async () => {
        await this.hre.run('verify:verify', {
          address: proxyAddress,
          constructorArguments: this.upgradeOptions.constructorArgs,
        })
      })
      return true
    }
    catch (e) {
      this.log(`An error occurred during verification. Set "DEBUG=${Deployer.name}:${this.verifyIfNeeded.name}" to see the details`)
    }
    return false
  }

  /**
   * Returns the proxy address from the cache (deployment data file) or deploys a new proxy first.
   */
  private async getOrCreateProxy(): Promise<string> {
    const proxyAddressFromCache = await this.hre.proxyRegister.getProxyAddress(this.contractName, this.deploymentId)
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
    await this.hre.proxyRegister.saveProxy(this.contractName, this.deploymentId, address)

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

  /**
   * Prints the debug message using specified logger.
   */
  private log(message: string, logger: debug.Debugger = this.logger) {
    logger(`[${this.contractName}.${this.deploymentId}] - ${message}`)
  }

  /**
   * Overrides console.* methods to prevent messages from code executed in {@param callback} from being output to stdout.
   * After the callback is executed, the "console" object will be reset,
   * and all messages that were passed to the console.* method will be output as debug messages.
   *
   * Used to prevent the hardhat subtask from sending unwanted messages to the console.
   */
  private async interceptOutput(taskName: string, callback: () => Promise<any>) {
    const fields = ['log', 'trace', 'debug', 'info', 'warn', 'error'] as const

    const messages: string[] = []
    function accumulateLogs(...input: string[]) {
      const message = input.join(' ')
      messages.push(message)
    }

    const temp: Array<Console[keyof Console]> = []
    for (const field of fields) {
      temp.push(console[field])
      console[field] = accumulateLogs.bind(this)
    }

    try {
      await callback()
    }
    // eslint-disable-next-line no-useless-catch
    catch (e) {
      throw e
    }
    finally {
      for (let i = 0; i < fields.length; i++) {
        console[fields[i]] = temp[i] as VoidFunction
      }

      const innerLogger = this.logger.extend(taskName)
      for (const message of messages) {
        this.log(message, innerLogger)
      }
    }
  }

  private async haveSameBytecode(implementationA: string, implementationB: string): Promise<boolean> {
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
