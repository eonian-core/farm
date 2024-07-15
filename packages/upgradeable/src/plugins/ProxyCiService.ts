import { HardhatRuntimeEnvironment } from "hardhat/types";
import { Context, WithLogger } from "./Context";
import { DeployState, DeployStatus } from "./DeployState";
import type { ContractFactory } from "ethers";
import debug from "debug";
import { UpgradeOptions } from "@openzeppelin/hardhat-upgrades";

/** Proxy continus integration service, responsibe for deploy and upgrate of proxy */
export class ProxyCiService extends WithLogger {
    public state = new DeployState()

    constructor(
        ctx: Context,
        public initArgs: unknown[],
        public upgradeOptions: UpgradeOptions = { constructorArgs: [true] }, // Disable initializers
        public contractFactory: ContractFactory,
        logger: debug.Debugger = debug(ProxyCiService.name)
    ) {
        super(ctx, logger)

        this.upgradeOptions = {
            kind: 'uups',
            redeployImplementation: 'onchange',
            ...this.upgradeOptions,
        }
    }

    static async init(
        ctx: Context,
        initArgs: unknown[],
        upgradeOptions: UpgradeOptions,
    ) {
        return new ProxyCiService(
            ctx,
            initArgs,
            upgradeOptions,
            await ctx.hre.ethers.getContractFactory(ctx.contractName)
        )
    }

    /**
     * Deploys a new proxy and implementation contract. Saves the proxy address to the deployment data file.
     * @returns The address of the proxy contract.
     */
    public async deployProxy(): Promise<string> {
        this.log('Starting proxy deployment...')

        const contract = await this.hre.upgrades.deployProxy(this.contractFactory, this.initArgs, this.upgradeOptions)
        await contract.waitForDeployment()
        const address = await contract.getAddress()
        this.log(`Succesfully deployed proxy to "${address}"`)

        await this.hre.proxyRegister.saveProxy(this.contractName, this.deploymentId, address)
        this.log(`Proxy with address "${address}" saved to the deployment data file...`)

        this.state.switchTo(DeployStatus.DEPLOYED)

        return address
    }

    /**
     * Validates and upgrades the specified proxy.
     * @param proxyAddress The address of the proxy to upgrade.
     */
    public async upgradeProxy(proxyAddress: string): Promise<void> {
        this.log(`Going to upgrade proxy "${proxyAddress}"...`)
        await this.hre.upgrades.upgradeProxy(proxyAddress, this.contractFactory, this.upgradeOptions)

        this.state.switchTo(DeployStatus.UPGRADED)
        this.log(`Proxy "${proxyAddress}" has been upgraded...`)
    }

    /**
     * Validates the implementation contract and deploys it if required (if the byte code has been changed).
     * (!) This function doesn't set the implementation address of the proxy.
     * @param proxyAddress The proxy address to get the current implementation from.
     * @returns Implementation address. Returns the current implementation of the proxy if no deployment has been made.
     */
    public async deployImplementationIfNeeded(proxyAddress: string): Promise<string> {
        this.log('Checking and deploy new implementation if needed...')
        const response = await this.hre.upgrades.prepareUpgrade(proxyAddress, this.contractFactory, this.upgradeOptions)
        if (typeof response !== 'string') {
            throw new TypeError(`Expected "string" address, but got ${JSON.stringify(response)}`)
        }

        return response
    }

    /**
     * Returns the proxy address from the cache (deployment data file).
     */
    public async findProxyInCache() {
        const proxyAddressFromCache = await this.hre.proxyRegister.getProxyAddress(this.contractName, this.deploymentId)
        this.log(`Proxy address "${proxyAddressFromCache}" ${proxyAddressFromCache ? 'was' : 'was not'} found in the deployment file`)

        return proxyAddressFromCache
    }


    /**
     * Returns the address of the current proxy implementation.
     * @param proxyAddress The address of the proxy.
     * @returns The implementation address.
     */
    public async getImplementation(proxyAddress: string): Promise<string> {
        const implAddres = await this.hre.upgrades.erc1967.getImplementationAddress(proxyAddress)
        this.log(`Retrived current implementation address: "${implAddres}" for proxy: "${proxyAddress}"`)
        return implAddres
    }
}