import type { DeployFunction, DeployResult } from 'hardhat-deploy/types'
import type { DeployArgs, DeployConfig } from '@eonian/upgradeable'
import { BaseDeploymentService, wrap } from '@eonian/upgradeable'
import { BlockchainType } from '../../../hardhat.config'

export type StubOptions = Record<string, string | bigint>

interface StubDeploymentParams {
  contract: string
  options: StubOptions
  onDeployResult: (result: DeployResult, args: DeployArgs, isUpgrade: boolean) => void
}

interface StubDeploymentConfig extends DeployConfig {
  options: StubOptions
  onDeployResult: (result: DeployResult, args: DeployArgs, isUpgrade: boolean) => void
}

export class StubDeployment extends BaseDeploymentService {
  onResolveInitArgs(): Promise<Array<any>> {
    const { options } = this.config as StubDeploymentConfig
    return Promise.resolve(Object.values(options))
  }

  async afterDeploy(result: DeployResult) {
    await this.emitResult(result, false)
  }

  async afterUpgrade(result: DeployResult) {
    await this.emitResult(result, true)
  }

  private async emitResult(result: DeployResult, isUpgrade: boolean) {
    const { onDeployResult } = this.config as StubDeploymentConfig
    const dependencies = await this.onResolveDependencies()
    const args = await this.onResolveArgs(dependencies)
    onDeployResult(result, args, isUpgrade)
  }
}

export function generateStubDeployment(params: StubDeploymentParams): DeployFunction {
  const { contract, options, onDeployResult } = params
  const config: StubDeploymentConfig = {
    contract,
    options,
    onDeployResult,
    chains: [BlockchainType.Local],
    tags: ['Test'],
  }
  return wrap(config, StubDeployment)
}
