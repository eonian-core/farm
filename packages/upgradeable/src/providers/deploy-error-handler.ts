import fs from 'node:fs'
import path from 'node:path'

import type { HardhatRuntimeEnvironment } from 'hardhat/types'

type ErrorManifestContent = Record<string, string>

export class DeployErrorHandler {
  public filePath: string

  constructor(
    readonly hre: HardhatRuntimeEnvironment,
  ) {
    this.filePath = path.resolve(this.hre.config.paths.deployments, `${hre.network.name}-deploy-errors.json`)
  }

  async createErrorManifestFile() {
    await fs.promises.writeFile(this.filePath, '{}')
  }

  async removeErrorManifestFile(): Promise<boolean> {
    try {
      await fs.promises.unlink(this.filePath)
      return true
    }
    catch (e) {
      return false
    }
  }

  async checkDeployResult() {
    const errors = await this.getManifestErrorFileContent()
    const numberOfErrors = Object.keys(errors).length
    if (numberOfErrors === 0) {
      return
    }
    throw new Error(`Deploy was unsuccesful, ${numberOfErrors} error(s) occured:\n ${JSON.stringify(errors, null, 2)}`)
  }

  async handleDeployError(error: unknown, deploymentName: string) {
    const errorMessage = this.getErrorMessage(error)

    const errors = await this.getManifestErrorFileContent()
    errors[deploymentName] = errorMessage

    const contentToWrite = JSON.stringify(errors, null, 2)
    await fs.promises.writeFile(this.filePath, contentToWrite)
  }

  private getErrorMessage(error: unknown): string {
    if (error instanceof Error) {
      return error.message
    }
    return String(error)
  }

  private async getManifestErrorFileContent(): Promise<ErrorManifestContent> {
    const content = await fs.promises.readFile(this.filePath, 'utf8')
    return JSON.parse(content) as ErrorManifestContent
  }
}
