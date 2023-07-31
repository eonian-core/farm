import { BlockchainType } from "../hardhat.config";
import {
  DeployConfig,
  BaseDeploymentService,
  BaseInitArgs,
  wrap,
} from "@eonian/upgradeable";

/**
 * Deploy LossRationHealthCheck.
 */
export const config: DeployConfig = {
  contract: "LossRatioHealthCheck",
  chains: [
    BlockchainType.Mainnet,
    BlockchainType.Testnet,
    BlockchainType.Local,
  ],
  tags: ["Default"],
};

export class LossRatioHealthCheckDeployment extends BaseDeploymentService {
  // eslint-disable-next-line no-empty-pattern
  async onResolveInitArgs({}: BaseInitArgs): Promise<Array<any>> {
    return [
      500, // shutdownLossRatio
    ];
  }
}

export default wrap(config, LossRatioHealthCheckDeployment);
