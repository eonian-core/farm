import type { HardhatRuntimeEnvironment } from 'hardhat/types'
import type { BaseDeploymentService } from './BaseDeployment.service'
import type { DeployConfig, IDependenciesContainer, Newable } from './DeploymentFactory'
import { Logger } from './logger/Logger'
import { DeploymentsAdapter } from './adapters/Deployments.adapter'
import { DependenciesAdapter } from './adapters/Dependencies.adapter'
import { EnvironmentAdapter } from './adapters/EnvironmentAdapter'
import { AccountsAdapter } from './adapters/Accounts.adapter'
import { ValidationProvider } from './providers'

export class DependenciesContainer<Config extends DeployConfig, Deployment extends BaseDeploymentService>
implements IDependenciesContainer<Config, Deployment> {
  resolve(
    ServiceClass: Newable<Deployment>,
    config: Config,
    hre: HardhatRuntimeEnvironment,
  ): Promise<Deployment> {
    const logger = new Logger(hre)
    const validation = new ValidationProvider(hre, logger)
    const deployments = new DeploymentsAdapter(hre, validation, logger)
    const dependenciesService = new DependenciesAdapter(hre)
    const accounts = new AccountsAdapter(hre)
    const enironment = new EnvironmentAdapter(hre)
    return Promise.resolve(
      new ServiceClass(config, dependenciesService, accounts, enironment, hre, deployments, logger),
    )
  }
}
