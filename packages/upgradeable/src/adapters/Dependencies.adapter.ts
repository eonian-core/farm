import { Deployment } from "@eonian/hardhat-deploy/types";
import { DependenciesService } from "../BaseDeployment.service";
import { HardhatRuntimeEnvironment } from "hardhat/types";

export class DependenciesAdapter implements DependenciesService {
    constructor(readonly hre: HardhatRuntimeEnvironment) { }
    
    async resolve(dependencies: Array<string>): Promise<Deployment[]> {
        const {get: getDeployment} = this.hre.deployments;

        return await Promise.all(
            dependencies.map((name) => getDeployment(name))
        );
    }
    
}