/// <reference path="../types.d.ts"/>
import type { Deployment } from 'hardhat-deploy/types'
import type { HardhatRuntimeEnvironment } from 'hardhat/types'
import type { DependenciesService } from '../BaseDeployment.service'

export class DependenciesAdapter implements DependenciesService {
  constructor(readonly hre: HardhatRuntimeEnvironment) {}

  async resolve(dependencies: Array<string>): Promise<Deployment[]> {
    const { get: getDeployment } = this.hre.deployments

    return await Promise.all(dependencies.map(name => getDeployment(name)))
  }
}
