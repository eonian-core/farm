import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction, Deployment, DeployResult } from "hardhat-deploy/types";
import { BlockchainType, NamedAccounts, Stage } from "../hardhat.config";

export interface ArgsFactoryOptions {
  accounts: NamedAccounts;
  stage: Stage;
  dependencies: Array<Deployment>;
}

export interface DeployUpgradableConfig {
  /** Name of contract */
  contract: string;
  /** Define on which blockchains this contract can be deploed */
  chains: Array<BlockchainType>;
  /** Additional tags */
  tags?: string[];

  /** List of contracts on which current contract depend, will be passed in getArgs function */
  dependencies?: string[];

  /** Function to generate arguments which will be passed to contract */
  getArgs: (options: ArgsFactoryOptions) => Array<any>;

  /** Function to run after deploy */
  afterDeploy?: (
    hre: HardhatRuntimeEnvironment,
    deployResult: DeployResult,
    dependencies: Array<Deployment>
  ) => Promise<void>;
}

/**
 * Deploy UUPS Proxy and implementation contract
 * or upgrade existing if already deployed
 * */
export const deployOrUpgrade = ({
  contract,
  chains,
  tags = [],
  dependencies = [],
  getArgs,
  afterDeploy,
}: DeployUpgradableConfig): DeployFunction => {
  const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
    const {
      getNamedAccounts,
      getChainId,
      network,
      deployments: { deploy, log, getNetworkName, get: getDeployment },
    } = hre;
    const accounts: NamedAccounts = (await getNamedAccounts()) as any;
    log("accounts", accounts);
    log("network", await getNetworkName());
    log("chainId", await getChainId());

    const deployedContracts = await Promise.all(
      dependencies.map((name) => getDeployment(name))
    );
    log(
      "dependencies",
      dependencies.reduce(
        (total, dep, index) => ({
          ...total,
          [dep]: deployedContracts[index].address,
        }),
        {}
      )
    );

    const { deployer } = accounts;

    const result = await deploy(contract, {
      from: deployer,
      log: true,
      gasLimit: 4000000, // fix for local deployments
      autoMine: true, // speed up deployment on local network (ganache, hardhat), no effect on live networks,
      args: [true], // Disable inititializers in implementaion contract
      proxy: {
        owner: deployer,
        proxyContract: "UUPS",
        proxyArgs: ["{implementation}", "{data}"], // specific for UUPS
        execute: {
          init: {
            methodName: "initialize",
            args: getArgs({
              accounts,
              stage: (network.config.tags?.[0] as Stage) || Stage.Development,
              dependencies: deployedContracts,
            }),
          },
        },
      },
    });

    await afterDeploy?.(hre, result, deployedContracts);
  };

  func.tags = [contract, ...chains, ...tags];

  func.skip = skipFactory(chains);

  func.dependencies = dependencies;

  return func;
};

export const skipFactory =
  (contractChains: Array<BlockchainType>) =>
  async ({ network }: HardhatRuntimeEnvironment): Promise<boolean> => {
    for (const chain of network.config.tags) {
      // Dont skip if contract expected to be deployed in this chain
      if (contractChains.includes(chain as BlockchainType)) {
        return false;
      }
    }

    return true;
  };
