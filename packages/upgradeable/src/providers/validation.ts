import type { ContractFactory } from 'ethers'
import type { HardhatRuntimeEnvironment } from 'hardhat/types'
import type { StandaloneOptions } from '@openzeppelin/hardhat-upgrades/dist/utils'
import type { Logger } from '../logger/Logger'

export class ValidationError extends Error {
  constructor(message: string) {
    super(message)

    this.name = 'ValidationError'
  }
}

export class ValidationProvider {
  constructor(
    readonly hre: HardhatRuntimeEnvironment,
    readonly logger: Logger,
  ) {}

  /**
   * Performs contract validation. Checks implementation contracts and compares storage layout to prevent memory shifts.
   * @param artifactName Name of the compiled contract.
   * @param deploymentName Name of the deployed contract. Consist from the actual contract name and tags.
   * @param hre Hardhat runtime environment.
   */
  async validate(artifactName: string, deploymentName: string, constructorArgs: unknown[]) {
    try {
      const options = { kind: 'uups', constructorArgs } satisfies StandaloneOptions

      this.logger.log('Validating contract implementation...')
      await this.validateImplementation(artifactName, options)

      this.logger.log('Validating storage layout for compatibility...')
      await this.validateUpgrade(artifactName, deploymentName, options)
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
   * Validates an implementation contract without deploying it.
   * Refer to https://docs.openzeppelin.com/upgrades-plugins/1.x/api-hardhat-upgrades#validate-implementation.
   * @param artifactName Name of the compiled contract.
   */
  private async validateImplementation(artifactName: string, options: StandaloneOptions) {
    const contractFactory = await this.getContractFactory(artifactName)
    await this.hre.upgrades.validateImplementation(contractFactory, options)
  }

  /**
   * Validates a new implementation contract without deploying it and without actually upgrading to it.
   * Compares the current implementation contract to the new implementation contract to check for storage layout compatibility errors.
   * Refer to https://docs.openzeppelin.com/upgrades-plugins/1.x/api-hardhat-upgrades#validate-upgrade.
   * @param artifactName Name of the compiled contract.
   * @param deploymentName Name of the deployed contract. Consist from the actual contract name and tags.
   */
  private async validateUpgrade(artifactName: string, deploymentName: string, options: StandaloneOptions) {
    const deployment = await this.hre.deployments.getOrNull(deploymentName)
    if (!deployment) {
      this.logger.log(`No deployment record found for "${deploymentName}". Has the contract never been deployed?`)
      return
    }

    const currentImplementationFactory = await this.getCurrentImplementationFactory(deploymentName)
    await this.hre.upgrades.forceImport(deployment.address, currentImplementationFactory, options)

    const contractFactory = await this.getContractFactory(artifactName)
    await this.hre.upgrades.validateUpgrade(deployment.address, contractFactory, options)
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

  /**
   * Returns a contract factory built from the current deployed implementation contract's data.
   * @param deploymentName Name of the deployment to validate.
   * @returnsContract factory created from existing implementation data.
   */
  private async getCurrentImplementationFactory(deploymentName: string): Promise<ContractFactory> {
    deploymentName = `${deploymentName}_Implementation`
    const deployment = await this.hre.deployments.get(deploymentName)
    if (!deployment.bytecode) {
      throw new Error(`No bytecode for deployment ${deploymentName}`)
    }
    return await this.hre.ethers.getContractFactory(deployment.abi, deployment.bytecode)
  }
}
