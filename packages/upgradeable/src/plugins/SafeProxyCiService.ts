import { UpgradeProxyOptions, deployProxyImpl, getSigner, attachITransparentUpgradeableProxyV5, attachITransparentUpgradeableProxyV4, UpgradeOptions } from "@openzeppelin/hardhat-upgrades/dist/utils";
import { Contract, ContractFactory, FunctionFragment, Signer } from "ethers";
import { getUpgradeInterfaceVersion } from "@openzeppelin/upgrades-core";
import debug from 'debug';

import { Context } from "./Context";
import { ProxyCiService, retryOnProviderError } from './ProxyCiService';
import { EtherscanVerifierAdapter } from './EtherscanVerifierAdapter';
import { sendTxWithRetry } from '../sendTxWithRetry';
import { SafeAdapter } from "./SafeAdapter";

export const needUseSafe = () => process.env.SAFE_WALLET_DEPLOY === 'true'

/**
 * Extends basic functionality of @openzepplin/hardhat-upgrades plugin by creating proposal transaction to upgrade proxy through Gnosis Safe Wallet.
 * Basded on https://github.com/OpenZeppelin/openzeppelin-upgrades/blob/master/packages/plugin-hardhat/src/upgrade-proxy.ts
 * 
 * !important: Do not support call option and admin contracts.
 */
export class SafeProxyCiService extends ProxyCiService {

    constructor(
        ctx: Context,
        initArgs: unknown[],
        contractFactory: ContractFactory,
        private verifier: EtherscanVerifierAdapter,
        private safe: SafeAdapter,
        upgradeOptions?: UpgradeOptions,
        logger: debug.Debugger = debug(SafeProxyCiService.name)
    ) {
        super(ctx, initArgs, contractFactory, upgradeOptions, logger)
    }

    static async initSafe(
        ctx: Context,
        initArgs: unknown[],
        verifier: EtherscanVerifierAdapter,
        safe: SafeAdapter,
        upgradeOptions?: UpgradeOptions,
    ) {
        return new SafeProxyCiService(
            ctx,
            initArgs,
            await ctx.hre.ethers.getContractFactory(ctx.contractName),
            verifier,
            safe,
            upgradeOptions,
        )
    }

    public async deployProxy(): Promise<string> {
        const address = await super.deployProxy()
        
        this.log(`Transfer ownership to the Safe Wallet ${this.safe.walletAddress}...`)
        const proxy = await this.hre.ethers.getContractAt(this.contractName, address)
        // expect that the contract implements Ownable interface
        if (!proxy.transferOwnership) {
            throw new Error(`Contract ${this.contractName} at address ${address} does not implement transferOwnership method, usally defined in Ownable base contract`)
        }
        await sendTxWithRetry(async () => await proxy.transferOwnership(this.safe.walletAddress))
        this.log(`Ownership transfered to ${this.safe.walletAddress}`)

        return address
    }

    async upgradeProxy(proxyAddress: string): Promise<void> {

        const { impl: nextImpl } = await retryOnProviderError(async () => 
            await deployProxyImpl(this.hre, this.contractFactory, this.upgradeOptions, proxyAddress)
        );
        this.log(`Deployed new implementation contract at address ${nextImpl}. Till transaction approve, this implementaion not will be verified, so will do it in advance`)
        await this.verifier.verifyIfNeeded(nextImpl, this.upgradeOptions.constructorArgs || []) 

        const signer = getSigner(this.contractFactory.runner)
        if(!signer) 
            throw new Error(`Signer for proxy contract "${proxyAddress}" is not defined`)

        // upgrade kind is inferred above
        const {proxy, functionName, args} = await this.chooseUpgradeCall(proxyAddress, nextImpl, this.upgradeOptions, signer);

        await this.safe.proposeTransaction(proxyAddress, proxy, functionName, args, signer)
    }

    async chooseUpgradeCall(proxyAddress: string, nextImpl: string, opts: UpgradeProxyOptions, signer?: Signer): Promise<{ proxy: Contract, functionName: string, args: Array<any>}> {
        const { provider } = this.hre.network;
        const upgradeInterfaceVersion = await getUpgradeInterfaceVersion(provider, proxyAddress, this.logger);

        const overrides = opts.txOverrides ? [opts.txOverrides] : [];

        switch (upgradeInterfaceVersion) {
            case '5.0.0': {
                const proxy = await attachITransparentUpgradeableProxyV5(this.hre, proxyAddress, signer);
                return {
                    proxy,
                    functionName: 'upgradeToAndCall',
                    // 0x for call fallback
                    args: [nextImpl, '0x', ...overrides]
                }
            }
            default: {
                if (upgradeInterfaceVersion !== undefined) {
                    // Log as debug if the interface version is an unknown string.
                    // Do not throw an error because this could be caused by a fallback function.
                    this.log(
                        `Unknown UPGRADE_INTERFACE_VERSION ${upgradeInterfaceVersion} for proxy at ${proxyAddress}. Expected 5.0.0`,
                    );
                }
                const proxy = await attachITransparentUpgradeableProxyV4(this.hre, proxyAddress, signer);
                return {
                    proxy,
                    functionName: 'upgradeTo',
                    args: [nextImpl, ...overrides]
                }
            }
        }
    }


}