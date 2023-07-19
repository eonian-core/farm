import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployResult, Deployment } from "@eonian/hardhat-deploy/types";

import { DeployArgs, DeploymentsService } from "../LifecycleDeployment.service";
import { Logger } from "../logger/Logger";



export class DeploymentsAdapter implements DeploymentsService {
    constructor(
        readonly hre: HardhatRuntimeEnvironment,
        readonly logger: Logger
    ) { }

    deploy({
        name,
        contract,
        deployer,
        owner,
        init: { args },
    }: DeployArgs): Promise<DeployResult> {
        return this.hre.deployments.deploy(name, {
            contract,
            from: deployer,
            log: true,
            gasLimit: 4000000, // fix for local deployments
            autoMine: true, // speed up deployment on local network (ganache, hardhat), no effect on live networks,
            args: [true], // Disable inititializers in implementaion contract
            proxy: {
                owner,
                proxyContract: "ERC1967Proxy", // base for UUPS, directly from OpenZeppelin
                proxyArgs: ["{implementation}", "{data}"], // specific for UUPS
                checkProxyAdmin: false,
                execute: {
                    init: {
                        methodName: "initialize",
                        args,
                    },
                },
            }
        });
    }

    async get(name: string): Promise<Deployment | undefined> {
        try {
            return await this.hre.deployments.get(name);
        } catch (e) {
            this.logger.log("Probably wasn't deployed before", e)
        }
    }

    async isDeployed(name: string): Promise<boolean> {
        const deployment = await this.get(name);
        return !!deployment;
    }

}