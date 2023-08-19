import { BaseDeploymentService } from './BaseDeployment.service';
import { DependenciesContainer } from './DependenciesContainer';
import { DeployConfig, DeploymentFactory, Newable } from './DeploymentFactory';

/** Wrap deployment to script function */
export function wrap<Config extends DeployConfig, Deployment extends BaseDeploymentService>(
  config: Config,
  serviceClass: Newable<Deployment>
) {
  const container = new DependenciesContainer<Config, Deployment>();
  const factory = new DeploymentFactory(container);

  return factory.build(config, serviceClass);
}
