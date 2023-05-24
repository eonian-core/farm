import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { NamedAccounts, Stage } from "../hardhat.config";

export interface ArgsFactoryOptions {
  accounts: NamedAccounts;
  stage: Stage;
}

export interface DeployUpgradableConfig {
  /** Name of contract */
  contract: string;
  /** Deploy only locally, default false */
  isLocal?: boolean;
  /** Additional tags */
  tags?: string[];

  /** Function to generate arguments which will be passed to contract */
  getArgs: (options: ArgsFactoryOptions) => Array<any>;
}

export const deployUpgradable = ({
  contract,
  isLocal = false,
  getArgs,
}: DeployUpgradableConfig): DeployFunction => {
  const func: DeployFunction = async function ({
    getNamedAccounts,
    getChainId,
    network,
    deployments: { deploy, log, getNetworkName },
  }: HardhatRuntimeEnvironment) {
    const accounts: NamedAccounts = (await getNamedAccounts()) as any;
    log("accounts", accounts);
    log("network", await getNetworkName());
    log("chainId", await getChainId());

    const { deployer } = accounts;

    await deploy(contract, {
      from: deployer,
      log: true,
      gasLimit: 4000000, // fix for local deployments
      autoMine: true, // speed up deployment on local network (ganache, hardhat), no effect on live networks,
      args: [true], // Disable inititializers in implementaion contract
      proxy: {
        owner: deployer,
        proxyContract: "OpenZeppelinTransparentProxy",
        execute: {
          methodName: "initialize",
          args: getArgs({
            accounts,
            stage: (network.config.tags?.[0] as Stage) || Stage.Development,
          }),
        },
      },
    });
  };

  func.tags = [contract, isLocal ? "local" : "mainnet"];
  if (isLocal) {
    // Skip this deploy if network is live (mainnet)
    func.skip = async ({ network }) => network.live;
  }

  return func;
};
