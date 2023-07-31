import { BlockchainType } from "../hardhat.config";
import {DeployConfig, BaseDeploymentService, BaseInitArgs, wrap} from '@eonian/upgradeable'

/**
 * Testing deploy of simple Gelato Job, only to test gelato or local fork
 */
export const config: DeployConfig = {
  contract: "SimpleGelatoJob",
  chains: [BlockchainType.Local],
  tags: ["Test"],
}

export class SimpleGelatoJobDeployment extends BaseDeploymentService {

  async onResolveInitArgs({accounts: { gelatoOps }}: BaseInitArgs): Promise<Array<any>> {
    return [
      gelatoOps,
      1001, // minimum time between executions in seconds
      true, // is prepayed
    ]
  }

}

export default wrap(config, SimpleGelatoJobDeployment);
