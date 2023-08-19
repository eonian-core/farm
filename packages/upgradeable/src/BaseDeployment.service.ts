/* eslint-disable @typescript-eslint/no-unused-vars */
import { DeployResult, Deployment, Address } from '@eonian/hardhat-deploy/types';
import { DeployArgs, DeploymentsService, LifecycleDeploymentService } from './LifecycleDeployment.service';
import { Logger } from './logger/Logger';
import { HardhatRuntimeEnvironment } from 'hardhat/types';

export interface DependenciesService {
  resolve: (names: Array<string>) => Promise<Deployment[]>;
}

export interface NamedAccounts {
  [name: string]: Address;

  /** Required for deployment */
  deployer: Address;
}

export interface AccountsService {
  get: () => Promise<NamedAccounts>;
}

export interface BaseDeploymentConfig {
  /** Name of contract to deploy */
  contract: string;
  /**
   * Tags which will be used to identify the deployment,
   * together with contract name must produce unique identifier
   * */
  tags: string[];
  /** List of contracts on which current contract depend, will be passed in getArgs function */
  dependencies?: string[];
}

/** Stage to which contracts is deployed, allow create multiple protocol stages on one blockchain */
export enum Stage {
  Development = 'development',
  Staging = 'staging',
  Production = 'production',
}

export interface EnvironmentService {
  getStage: () => Promise<Stage>;
}

export interface BaseInitArgs {
  accounts: NamedAccounts;
  stage: Stage;
  dependencies: Deployment[];
}

/** Service which must be used as bases for all deployments */
export class BaseDeploymentService extends LifecycleDeploymentService {
  constructor(
    readonly config: BaseDeploymentConfig,
    readonly dependencies: DependenciesService,
    readonly accounts: AccountsService,
    readonly environment: EnvironmentService,
    hre: HardhatRuntimeEnvironment,
    deployments: DeploymentsService,
    logger: Logger
  ) {
    super(hre, deployments, logger);

    if (config.tags.length < 1) {
      throw new Error(`Contract must have at least one tag`);
    }
  }

  onResolveDependencies(): Promise<Deployment[]> {
    const { dependencies = [] } = this.config;

    return this.dependencies.resolve(dependencies);
  }

  generateContractName() {
    const { contract, tags } = this.config;
    return [contract, ...tags].join('|'); // hardhat-deploy disallow to use "/" or ":" in contract names
  }

  async onResolveArgs(dependencies: Deployment[]): Promise<DeployArgs> {
    const accounts = await this.accounts.get();
    const { deployer } = accounts;

    return {
      name: this.generateContractName(),
      contract: this.config.contract,
      deployer,
      owner: deployer, // TODO: allow to override owner
      init: {
        args: await this.onResolveInitArgs({
          accounts,
          stage: await this.environment.getStage(),
          dependencies,
        }),
      },
    };
  }

  /** Allow to override init method args, will be passed only one time */
  async onResolveInitArgs(args: BaseInitArgs): Promise<Array<any>> {
    return [];
  }

  async afterDeploy(deployResult: DeployResult, dependencies: Array<Deployment>): Promise<void> {}

  async afterUpgrade(deployResult: DeployResult, dependencies: Array<Deployment>): Promise<void> {}
}
