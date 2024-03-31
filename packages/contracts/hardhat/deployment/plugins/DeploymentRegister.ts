import fs from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import type { HardhatRuntimeEnvironment } from 'hardhat/types'
import debug from 'debug'
import { merge } from 'lodash'
import { extendEnvironment } from 'hardhat/config'
import { NetworkEnvironment, resolveNetworkEnvironment } from '../../types'

/**
 * Due to the fact that the OpenZeppelin manifest file does not contain information about
 * the name of the contract that was deployed, we need to store this data ourselves.
 * This is necessary because we need to know which proxy needs to be updated when the implementation changes.
 * This class contains a set of methods to save or read a local file with the information mentioned above.
 */

/**
 * Represents a lookup map ("contract name" to "{@link ContractDeploymentData}")
 */
export type DeploymentFile = Record<string, Record<string, string>>

const DEPLOYMENT_DATA_DIR = '.deployments'
const DEFAULT_DEPLOYMENT_ID = 'default'

declare module 'hardhat/types/runtime' {
  export interface HardhatRuntimeEnvironment {
    deploymentRegister: DeploymentRegister
  }
}

extendEnvironment((hre) => {
  hre.deploymentRegister = new DeploymentRegister(hre)
})

/**
 * A utility class that is used to keep track of each deployed proxy with
 * a separate .json file for each network in the {@link DEPLOYMENT_DATA_DIR} directory.
 */
class DeploymentRegister {
  private log = debug(DeploymentRegister.name)

  private registerFilePath: string | null = null

  constructor(private hre: HardhatRuntimeEnvironment) {}

  /**
   * Returns proxy address from the deployment data file.
   */
  public async getProxyAddress(contractName: string, deploymentId: string | null): Promise<string | null> {
    deploymentId ??= DEFAULT_DEPLOYMENT_ID
    const data = await this.read()
    const contractData = data[contractName]
    if (!contractData) {
      this.log(`Missing deployment data for contract "${contractName}"`)
      return null
    }
    const proxy = contractData[deploymentId]
    if (!proxy) {
      this.log(`Missing proxy address for contract "${contractName}", deployment: "${deploymentId}"`)
      return null
    }
    return proxy
  }

  /**
   * Saves the specified proxy address to the deployment data file.
   */
  public async saveProxy(contractName: string, deploymentId: string | null, address: string): Promise<void> {
    deploymentId ??= DEFAULT_DEPLOYMENT_ID
    const currentProxyAddress = await this.getProxyAddress(contractName, deploymentId)
    if (currentProxyAddress !== null && currentProxyAddress !== address) {
      throw new Error(
        `Trying to override existing proxy address with value "${address}" (contract: "${contractName}", deployment: "${deploymentId}")!`,
      )
    }
    await this.writePatch({
      [contractName]: { [deploymentId]: address },
    })
  }

  /**
   * Reads the chain file (populated from {@link getRegisterFilePath}) and returns its content.
   * @returns The content of deployment data file.
   */
  public async read(): Promise<DeploymentFile> {
    try {
      const deploymentFilePath = await this.ensureFileExists()
      const content = await fs.readFile(deploymentFilePath, 'utf-8')
      return JSON.parse(content) as DeploymentFile
    }
    catch (error) {
      throw new Error(`Unable to read deployment file: ${String(error)}`)
    }
  }

  /**
   * Writes the data to the chain file.
   * @param data The fiile content.
   */
  public async write(data: DeploymentFile): Promise<void> {
    try {
      const deploymentFilePath = await this.ensureFileExists()
      const content = JSON.stringify(data, null, 2)
      await fs.writeFile(deploymentFilePath, content, { encoding: 'utf-8' })
    }
    catch (error) {
      throw new Error(`Unable to save deployment file: ${String(error)}`)
    }
  }

  /**
   * Combines the passed delta with existing data in the chain file and saves it.
   * @param patch The file content delta.
   */
  public async writePatch(patch: Partial<DeploymentFile>): Promise<void> {
    const data = merge(await this.read(), patch)
    await this.write(data)
  }

  /**
   * Creates the chain file with the default content if it's missing.
   * @returns The chain file path.
   */
  public async ensureFileExists(): Promise<string> {
    const deploymentFilePath = this.getRegisterFilePath()
    try {
      await fs.access(deploymentFilePath, fs.constants.F_OK)
    }
    catch (error) {
      const errorCode = this.getErrorCode(error)
      if (errorCode !== 'ENOENT') {
        throw error
      }
      this.log(`File "${deploymentFilePath}" is missing, it's going to be created...`)
      await fs.mkdir(path.dirname(deploymentFilePath), { recursive: true })

      const content = this.getDefaultFileContent()
      await fs.writeFile(deploymentFilePath, content)
    }
    return deploymentFilePath
  }

  /**
   * Deletes the current chain file, used in tests.
   */
  public async deleteFile(): Promise<void> {
    const deploymentFilePath = await this.ensureFileExists()
    await fs.rm(deploymentFilePath, { force: true })
  }

  /**
   * Constructs the default content for chain file.
   */
  private getDefaultFileContent(): string {
    const content: DeploymentFile = {}
    return JSON.stringify(content, null, 2)
  }

  /**
   * Builds the path to for the chain file.
   * If the hardhat script is executed locally, the registry file will be saved in the tmp directory.
   */
  private getRegisterFilePath(): string {
    if (this.registerFilePath !== null) {
      return this.registerFilePath
    }

    const fileName = `${this.hre.network.name}.json`
    let filePath = path.join(DEPLOYMENT_DATA_DIR, fileName)

    const networkEnvironment = resolveNetworkEnvironment(this.hre)
    if (networkEnvironment === NetworkEnvironment.LOCAL) {
      filePath = path.join(os.tmpdir(), DEPLOYMENT_DATA_DIR, `${Date.now()}-${fileName}`)
    }
    return (this.registerFilePath = filePath)
  }

  /**
   * Tries to get the error code from NodeJS throwable.
   */
  private getErrorCode(error: unknown): string | null {
    if (error === null || typeof error !== 'object') {
      return null
    }
    return 'code' in error ? String(error.code) : null
  }
}
