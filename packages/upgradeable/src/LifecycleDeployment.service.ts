import {
    Deployment,
    DeployResult,
} from "@eonian/hardhat-deploy/types";
import { Logger } from "./logger/Logger";
import { HardhatRuntimeEnvironment } from "hardhat/types";
  
export interface DeployArgs {
    /** Name of artifact to deploy, will be used to reference contract in dependencies */
    name: string;
    /** Name of contract in code or ABI, which must be deployed */
    contract: string;
    /** Address of deploy account */
    deployer: string;
    /** Address of owner of contract, used to make upgrade calls */
    owner: string;
    /** Arguments for initialze call which triggered after first deploy */
    init: {
        /** Arguments to pass for function call */
        args: any[];
    }
}

/** 
 * Minimal wrapper around hardhat-deploy/deployments object, 
 * provides simplified interface.
 * Allow test deploy call logic without hardhat runtime environment.
 * */
export interface DeploymentsService {
    /** Deploy function wrapper */
    deploy: (args: DeployArgs) => Promise<DeployResult>

    /** Get existing deployment contract, if contract not found returns undefined */
    get: (name: string) => Promise<Deployment | undefined>;

    /** Check if contract already deployed */
    isDeployed: (name: string) => Promise<boolean>;
}

export abstract class LifecycleDeploymentService {

    constructor(
        readonly hre: HardhatRuntimeEnvironment,
        readonly deployments: DeploymentsService,
        readonly logger: Logger
    ) {}

    async deploy(){
        const dependencies = await this.onResolveDependencies();
        this.logger.debug('Resolved dependencies', dependencies)
        const args = await this.onResolveArgs(dependencies);
        this.logger.log('Resolved deployment args', args)

        const isDeployedBefore = await this.deployments.isDeployed(args.name);

        const result = await this.onDeploy(args);
        this.logger.debug('Deployed contract', result)

        if (!isDeployedBefore) {
            this.logger.log("Contract wasn't deployed before, run afterDeploy hook")
            await this.afterDeploy(result, dependencies);
        } else {
            this.logger.log("Contract was deployed before, run afterUpgrade hook")
            await this.afterUpgrade(result, dependencies);
        }
    }

    async onDeploy(args: DeployArgs): Promise<DeployResult> {
        return this.deployments.deploy(args);
    }

    abstract onResolveDependencies(): Promise<Array<Deployment>>

    /** Resolve arguments for deployment contract */
    abstract onResolveArgs(dependencies: Array<Deployment>): Promise<DeployArgs> 

    /** 
     * Hook which will be run after deploy
     * @param deployResult Result of deploy function
     * */
    abstract afterDeploy(deployResult: DeployResult, dependencies: Array<Deployment>): Promise<void>

    /**
     * Hook which will be run after upgrade
     * @param deployResult Result of deploy function
     * */
    abstract afterUpgrade(deployResult: DeployResult, dependencies: Array<Deployment>): Promise<void>
}