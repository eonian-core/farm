/// <reference path="../types.d.ts"/>
import type { HardhatRuntimeEnvironment } from 'hardhat/types'
import type { EnvironmentService } from '../BaseDeployment.service'
import { Stage } from '../BaseDeployment.service'

const possibleStageValues = Object.values(Stage)

export class EnvironmentAdapter implements EnvironmentService {
  constructor(readonly hre: HardhatRuntimeEnvironment) {}

  /** Returns first tag which matches stage enum or development if nothing is found */
  getStage(): Promise<Stage> {
    const { network } = this.hre

    const tags = network.config.tags || []

    const stage = tags.find(tag => possibleStageValues.includes(tag as Stage)) as Stage | undefined

    return Promise.resolve(stage || Stage.Development)
  }
}
