import { HardhatRuntimeEnvironment } from "hardhat/types";
import { EnvironmentService, Stage } from "../BaseDeployment.service";

export class EnvironmentAdapter implements EnvironmentService {

    constructor(readonly hre: HardhatRuntimeEnvironment) { }

    async getStage(): Promise<Stage> {
        const { network } = this.hre;
        // expects that first tag of network indicates the stage
        return (network.config.tags?.[0] as Stage) || Stage.Development
    }
    
}