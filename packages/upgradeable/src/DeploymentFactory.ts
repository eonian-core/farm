import { DeployFunction } from "@eonian/hardhat-deploy/types";
import { BaseDeploymentConfig, BaseDeploymentService } from "./BaseDeployment.service";
import { HardhatRuntimeEnvironment } from "hardhat/types";

export type Newable<T> = { new (...args: any[]): T; };

export interface DeployConfig extends BaseDeploymentConfig {
  /** Define on which blockchains this contract can be deploed */
  chains: Array<string>;
}

export type SkipFunction = (hre: HardhatRuntimeEnvironment) => Promise<boolean>;

/** Dependency injection container */
export interface IDependenciesContainer<Config extends DeployConfig, Deployment extends BaseDeploymentService> {
    resolve: (serviceClass: Newable<Deployment>, config: Config, hre: HardhatRuntimeEnvironment) => Promise<Deployment>;
}

/** Factory used to create deploy function which can be later executed for deploy */
export class DeploymentFactory<Config extends DeployConfig, Deployment extends BaseDeploymentService> {

    constructor(
        readonly container: IDependenciesContainer<Config, Deployment>
    ) {}

    build(config: Config, serviceClass: Newable<Deployment>): DeployFunction {
        const container = this.container;

        const func: DeployFunction = async function (hre)  {
            const service = await container.resolve(serviceClass, config, hre);

            await service.deploy();
        };

        func.tags = [config.contract, ...config.chains, ...config.tags];
        
        func.skip = this.skip(config.chains);

        return func;
    }

    skip(contractChains: Array<string>): SkipFunction {
        return async ({ network }: HardhatRuntimeEnvironment): Promise<boolean> => {
            for (const chain of network.config.tags) {
              // Dont skip if contract expected to be deployed in this chain
              if (contractChains.includes(chain)) {
                return false;
              }
            }
        
            return true;
        };
    }

}