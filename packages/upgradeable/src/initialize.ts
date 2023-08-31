import type { BaseDeploymentService } from './BaseDeployment.service'
import { DependenciesContainer } from './DependenciesContainer'
import type { DeployConfig, Newable } from './DeploymentFactory'
import { DeploymentFactory } from './DeploymentFactory'

/** Wrap deployment to script function */
export function wrap<Config extends DeployConfig, Deployment extends BaseDeploymentService>(
  config: Config,
  serviceClass: Newable<Deployment>,
) {
  const container = new DependenciesContainer<Config, Deployment>()
  const factory = new DeploymentFactory(container)

  return factory.build(config, serviceClass)
}
