import debug from 'debug'
import type { HardhatRuntimeEnvironment } from 'hardhat/types'
import type { ContractFactory } from 'ethers'
import { Context } from "./Context";
import { DeployState, DeployStatus } from './DeployState'

export class BaseDeployer extends Context {
    private contractFactory: ContractFactory | null = null
    protected state = new DeployState()

    constructor(
        logger: debug.Debugger,
        hre: HardhatRuntimeEnvironment,
        contractName: string,
        deploymentId: string | null,
    ) {
        super(logger, hre, contractName, deploymentId)
    }

    protected async executePreDeployHook(): Promise<void> {
        const onBeforeDeploy = this.hre.onBeforeDeploy
        if (onBeforeDeploy) {
            await onBeforeDeploy(this.contractName, this.deploymentId)
        }
    }

    /**
     * Returns the proxy address from the cache (deployment data file).
     */
    public async findProxyInCache() {
        const proxyAddressFromCache = await this.hre.proxyRegister.getProxyAddress(this.contractName, this.deploymentId)
        if (proxyAddressFromCache) {
            this.log(`Proxy address "${proxyAddressFromCache} was found in the deployment file`)
        }
        
        return proxyAddressFromCache
    }


    /**
     * Returns the address of the current proxy implementation.
     * @param proxyAddress The address of the proxy.
     * @returns The implementation address.
     */
    protected async getImplementation(proxyAddress: string): Promise<string> {
        const implAddres = await this.hre.upgrades.erc1967.getImplementationAddress(proxyAddress)
        this.log(`Retrived current implementation address: "${implAddres}" for proxy: "${proxyAddress}"`)
        return implAddres
    }

    /**
     * Returns the contract factory.
     */
    protected async getContractFactory(): Promise<ContractFactory> {
        return this.contractFactory ??= await this.hre.ethers.getContractFactory(this.contractName)
    }
}