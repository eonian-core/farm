import debug from 'debug'
import type { HardhatRuntimeEnvironment } from 'hardhat/types'
import { Manifest } from '@openzeppelin/upgrades-core'
import type { UpgradeOptions, DefenderDeployOptions } from '@openzeppelin/hardhat-upgrades/dist/utils'
import type { ContractFactory } from 'ethers'
import type { ApprovalProcess } from '@openzeppelin/hardhat-upgrades/dist/defender/get-approval-process'
import type { UpgradeProposalResponse } from '@openzeppelin/hardhat-upgrades/dist/defender/propose-upgrade-with-approval'

export const needUseDefender = () => process.env.OPENZEPPLIN_DEFENDER_DEPLOY === 'true'

export type DeployerOptions = UpgradeOptions & DefenderDeployOptions;

export enum DeployStatus {
  DEPLOYED = 'DEPLOYED',
  UPGRADED = 'UPGRADED',
  NONE = 'NONE',
}

export interface DeployResult {
  contractName: string
  deploymentId: string | null
  proxyAddress: string
  implementationAddress?: string
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
    private contractName: string,
    private deploymentId: string | null,
    private initArgs: unknown[],
    private options: DeployerOptions = { constructorArgs: [true] }, // Disable initializers
  ) {
    this.options = {
      kind: 'uups',
      redeployImplementation: 'onchange',
      useDefenderDeploy: needUseDefender(),
      verifySourceCode: true,
      // SMART_CONTRACTS_LICENSE_TYPE also used in contracts/check-license.js script
      licenseType: process.env.SMART_CONTRACTS_LICENSE_TYPE || 'AGPL-3.0' as any,
      ...this.options,
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

    if(!this.options.useDefenderDeploy) {
      // the rest of deploy process will be handled by OpenZeppelin Defender
      const sameImplementationCode = await this.haveSameBytecode(proxyImplementationAddress, implementationAddress as string)
      if (!sameImplementationCode) {
        this.log(`Implementation changed: ${implementationAddress} (new) != ${proxyImplementationAddress} (old)!`)
        await this.upgradeProxy(proxyAddress)
      }
    }

    return (this.hre.lastDeployments[proxyAddress] = {
      proxyAddress,
      implementationAddress,
      contractName: this.contractName,
      deploymentId: this.deploymentId,
      status: this.deployStatus,
      verified: await this.hre.etherscanVerifier.verifyIfNeeded(proxyAddress, this.options.constructorArgs),
    })
  }

  private async executePreDeployHook(): Promise<void> {
    const onBeforeDeploy = this.hre.onBeforeDeploy
    if (onBeforeDeploy) {
      await onBeforeDeploy(this.contractName, this.deploymentId)
    }
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
    
    const {useDefenderDeploy} = this.options;
    let defenderProcess: ApprovalProcess | undefined;
    if (useDefenderDeploy) {
      this.log('Will try to deploy using OpenZeppelin Defender...')
      defenderProcess = await this.hre.defender.getUpgradeApprovalProcess();
      if(!defenderProcess.address) {
        throw new Error(`OpenZepplin Defender upgrade approval process with id ${defenderProcess.approvalProcessId} has no assigned address`)
      }
      this.log(`Resolved OpenZeppelin Defender approval process address: ${defenderProcess.address}`)
    }

    const factory = await this.getContractFactory()
    this.log(`Constructor types ${JSON.stringify(factory.interface.deploy.inputs)} and args ${JSON.stringify(this.options.constructorArgs)}`)

    const contract = await this.hre.upgrades.deployProxy(factory, this.initArgs, this.options)
    const address = await contract.getAddress()

    this.log(`Saving proxy address "${address}" to the deployment data file...`)
    await this.hre.proxyRegister.saveProxy(this.contractName, this.deploymentId, address)
    this.changeDeployStatus(DeployStatus.DEPLOYED)

    if (defenderProcess) {
      this.log("Transfer ownership to the OpenZepplin Defender approval process...")
      const proxy = await this.hre.ethers.getContractAt(this.contractName, address)
      // expect that the contract implements Ownable interface
      if(!proxy.transferOwnership) {
        throw new Error(`Contract ${this.contractName} at address ${address} does not implement transferOwnership method, usally defined in Ownable base contract`)
      }
      const tx = await proxy.transferOwnership(defenderProcess.address!)  
      await tx.wait()
    }
    
    return address
  }

  /**
   * Validates and upgrades the specified proxy.
   * @param proxyAddress The address of the proxy to upgrade.
   */
  private async upgradeProxy(proxyAddress: string): Promise<void> {
    this.log(`Going to upgrade proxy "${proxyAddress}"...`)
    await this.hre.upgrades.upgradeProxy(proxyAddress, await this.getContractFactory(), this.options)

    this.changeDeployStatus(DeployStatus.UPGRADED)
  }

  /**
   * Validates the implementation contract and deploys it if required (if the byte code has been changed).
   * (!) This function doesn't set the implementation address of the proxy.
   * @param proxyAddress The proxy address to get the current implementation from.
   * @returns Implementation address. Returns the current implementation of the proxy if no deployment has been made.
   */
  private async deployImplementationIfNeeded(proxyAddress: string): Promise<string | undefined> {
    const contractFactory = await this.hre.ethers.getContractFactory(this.contractName)

    if(this.options.useDefenderDeploy) {
      const proposal = await this.hre.defender.proposeUpgradeWithApproval(proxyAddress, contractFactory, this.options)
      this.log(`Upgrade proposed with URL: ${proposal.url}`)
      return
    }

    const response = await this.hre.upgrades.prepareUpgrade(proxyAddress, contractFactory, this.options)
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
