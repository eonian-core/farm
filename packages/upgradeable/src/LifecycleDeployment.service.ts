import {
    Deployment,
    DeployResult,
} from "@eonian/hardhat-deploy/types";
  
export interface DeployArgs {
    /** Name of contract to deploy */
    name: string;
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

export class LifecycleDeploymentService {

    constructor(
        readonly deployments: DeploymentsService,
        readonly args: DeployArgs
    ) {}

    async deploy(){
        const isDeployedBefore = await this.deployments.isDeployed(this.args.name);

        const result = await this.onDeploy();

        if (isDeployedBefore) {
            await this.afterDeploy(result);
        } else {
            await this.afterUpgrade(result);
        }
    }

    async onDeploy(): Promise<DeployResult> {
        return this.deployments.deploy(this.args);
    }

    /** 
     * Hook which will be run after deploy
     * @param deployResult Result of deploy function
     * */
    async afterDeploy(deployResult: DeployResult): Promise<void> {}

    /**
     * Hook which will be run after upgrade
     * @param deployResult Result of deploy function
     * */
    async afterUpgrade(deployResult: DeployResult): Promise<void> {}
}