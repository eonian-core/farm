import type { ContractFactory } from 'ethers'
import type { HardhatRuntimeEnvironment } from 'hardhat/types'
import type { StandaloneOptions } from '@openzeppelin/hardhat-upgrades/dist/utils'
import { Manifest } from '@openzeppelin/upgrades-core'
import type { Logger } from '../logger/Logger'

export class ValidationError extends Error {
  constructor(message: string) {
    super(message)

    this.name = 'ValidationError'
  }
}

export class ValidationProvider {
  private options: StandaloneOptions

  constructor(
    readonly hre: HardhatRuntimeEnvironment,
    readonly logger: Logger,
  ) {
    this.options = { kind: 'uups', constructorArgs: [true] }
  }

  /**
   * Performs contract validation. Checks implementation contracts and compares storage layout to prevent memory shifts.
   * @param artifactName Name of the compiled contract.
   * @param deploymentName Name of the deployed contract. Consist from the actual contract name and tags.
   * @param hre Hardhat runtime environment.
   */
  async validate(artifactName: string, deploymentName: string) {
    try {
      this.logger.log('Validating local deployment data...')
      await this.validateDataInSync(artifactName, deploymentName)

      this.logger.log('Validating contract implementation...')
      await this.validateImplementation(artifactName)

      this.logger.log('Validating storage layout for compatibility...')
      await this.validateUpgrade(artifactName, deploymentName)
    }
    catch (error) {
      if (error instanceof Error) {
        const customError = new ValidationError(`Validation failed for "${deploymentName}": ${error.message}`)
        customError.stack += `\nCaused by: ${error.stack}`
        throw customError
      }
      throw error
    }
  }

  /**
 * Creates (or updates) OpenZepellin network data (.openzepellin folder).
 * Required for further contracts validation.
 */
  async saveImplementationData(contractName: string, proxyAddress: string) {
    try {
      const factory = await this.hre.ethers.getContractFactory(contractName)
      await this.hre.upgrades.forceImport(proxyAddress, factory, this.options)
    }
    catch (error) {
      if (error instanceof Error) {
        const message = (error.stack || error.message).toLowerCase()
        const isClashError = message.includes('clash')
        if (isClashError) {
          return
        }
      }
      throw error
    }
  }

  /**
   * Validates an implementation contract without deploying it.
   * Refer to https://docs.openzeppelin.com/upgrades-plugins/1.x/api-hardhat-upgrades#validate-implementation.
   * @param artifactName Name of the compiled contract.
   */
  private async validateImplementation(artifactName: string) {
    const contractFactory = await this.getContractFactory(artifactName)
    await this.hre.upgrades.validateImplementation(contractFactory, this.options)
  }

  /**
   * Checks if proxy & implementation addresses in the local deployment cache is the same as remote on the blockchain.
   * @param artifactName Name of the compiled contract.
   * @param deploymentName Name of the deployed contract. Consist from the actual contract name and tags.
   * @param hre Hardhat runtime environment.
   */
  private async validateDataInSync(artifactName: string, deploymentName: string) {
    const deployment = await this.hre.deployments.getOrNull(deploymentName)
    if (!deployment) {
      this.logger.debug(`No deployment record found for "${deploymentName}". Has the contract never been deployed?`)
      return
    }

    const skipValidationFor = process.env.SKIP_DATA_IN_SYNC_VALIDATION ?? ''
    if (skipValidationFor.includes(artifactName) || skipValidationFor === '*') {
      this.logger.warn(`Variable "SKIP_DATA_IN_SYNC_VALIDATION" contains "${artifactName}", validation will be skipped for this artifact`)
      return
    }

    const implementationAddress = await this.hre.upgrades.erc1967.getImplementationAddress(deployment.address)
    if (implementationAddress !== deployment.implementation) {
      throw new Error('The address of the implementation (local, from deployment) is not the same as the address on the blockchain!')
    }

    const manifest = await Manifest.forNetwork(this.hre.network.provider)
    try {
      await manifest.getProxyFromAddress(deployment.address)
    }
    catch (error) {
      throw new Error(`Proxy "${deployment.address}" was not found in OZ network data file!`)
    }

    try {
      await manifest.getDeploymentFromAddress(deployment.implementation)
    }
    catch (error) {
      throw new Error(`implementation "${deployment.address}" of "${artifactName}" was not found in OZ network data file!`)
    }
  }

  /**
   * Validates a new implementation contract without deploying it and without actually upgrading to it.
   * Compares the current implementation contract to the new implementation contract to check for storage layout compatibility errors.
   * Refer to https://docs.openzeppelin.com/upgrades-plugins/1.x/api-hardhat-upgrades#validate-upgrade.
   * @param artifactName Name of the compiled contract.
   * @param deploymentName Name of the deployed contract. Consist from the actual contract name and tags.
   */
  private async validateUpgrade(artifactName: string, deploymentName: string) {
    const deployment = await this.hre.deployments.getOrNull(deploymentName)
    if (!deployment) {
      this.logger.debug(`No deployment record found for "${deploymentName}". Has the contract never been deployed?`)
      return
    }

    const contractFactory = await this.getContractFactory(artifactName)
    await this.hre.upgrades.validateUpgrade(deployment.address, contractFactory, this.options)
  }

  /**
   * Returns a contract factory built from the compiled artifact.
   * @param artifactName Name of the compiled contract.
   * @returns Contract factory created from existing artifact.
   */
  private async getContractFactory(artifactName: string): Promise<ContractFactory> {
    const isArtifactExist = await this.hre.artifacts.artifactExists(artifactName)
    if (!isArtifactExist) {
      throw new Error(`Artifact "${artifactName} does not exist`)
    }
    const artifact = await this.hre.artifacts.readArtifact(artifactName)
    return await this.hre.ethers.getContractFactory(artifact.abi, artifact.bytecode)
  }
}
