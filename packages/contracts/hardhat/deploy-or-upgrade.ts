import { HardhatRuntimeEnvironment } from "hardhat/types";
import {
  DeployFunction,
  Deployment,
  DeployResult,
  DeploymentsExtension,
} from "@eonian/hardhat-deploy/types";
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
      network,
      deployments: { deploy, get: getDeployment },
    } = hre;
    const { accounts } = await extractContext(hre);

    const deployedContracts = await resolveDependencies(
      hre.deployments,
      dependencies
    );

    const { deployer } = accounts;

    const oldDeployment = await getDeployment(contract);

    const result = await deploy(contract, {
      from: deployer,
      log: true,
      gasLimit: 4000000, // fix for local deployments
      autoMine: true, // speed up deployment on local network (ganache, hardhat), no effect on live networks,
      args: [true], // Disable inititializers in implementaion contract
      proxy: {
        owner: deployer,
        proxyContract: "ERC1967Proxy", // base for UUPS, directly from OpenZeppelin
        proxyArgs: ["{implementation}", "{data}"], // specific for UUPS
        checkProxyAdmin: false,
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

    // trigger only on first deploy
    if (!oldDeployment?.implementation) {
      await afterDeploy?.(hre, result, deployedContracts);
    }
  };

  func.tags = [contract, ...chains, ...tags];

  func.skip = skipFactory(chains);

  func.dependencies = dependencies;

  return func;
};

export interface Context {
  accounts: NamedAccounts;
  networkName: string;
  chainId: string;
}

/** Extract context from enviroment */
export const extractContext = async ({
  getNamedAccounts,
  getChainId,
  deployments: { getNetworkName, log },
}: HardhatRuntimeEnvironment): Promise<Context> => {
  const context = {
    accounts: (await getNamedAccounts()) as any,
    networkName: await getNetworkName(),
    chainId: await getChainId(),
  };
  log("context", context);

  return context;
};

/** Retive contracts based on dependencies list */
export const resolveDependencies = async (
  { get: getDeployment, log }: DeploymentsExtension,
  dependencies: Array<string>
) => {
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

  return deployedContracts;
};

/**
 * Generate function which define when need skip deployment execution
 * Based on network tags and contract chains.
 * If contract chains not include network tag, then skip deployment
 * */
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
