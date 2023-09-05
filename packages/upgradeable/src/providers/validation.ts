import type { ContractFactory } from 'ethers'
import type { HardhatRuntimeEnvironment } from 'hardhat/types'
import type { Logger } from '../logger/Logger'

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
  async validate(artifactName: string, deploymentName: string) {
    this.logger.log('Validating contract implementation...')
    await this.validateImplementation(artifactName)

    this.logger.log('Validating storage layout for compatibility...')
    await this.validateUpgrade(artifactName, deploymentName)
  }

  /**
   * Validates an implementation contract without deploying it.
   * Refer to https://docs.openzeppelin.com/upgrades-plugins/1.x/api-hardhat-upgrades#validate-implementation.
   * @param artifactName Name of the compiled contract.
   */
  private async validateImplementation(artifactName: string) {
    const contractFactory = await this.getContractFactory(artifactName)
    await this.hre.upgrades.validateImplementation(contractFactory)
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
    if (deployment === null) {
      this.logger.log(`No deployment record found for "${deploymentName}". Has the contract never been deployed?`)
      return
    }
    const contractFactory = await this.getContractFactory(artifactName)
    await this.hre.upgrades.validateUpgrade(deployment.address, contractFactory, { kind: 'uups' })
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
