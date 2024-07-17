import SafeApiKit from '@safe-global/api-kit'
import Safe from '@safe-global/protocol-kit'
import { UpgradeProxyOptions, deployProxyImpl, getSigner, attachITransparentUpgradeableProxyV5, attachITransparentUpgradeableProxyV4, UpgradeOptions } from "@openzeppelin/hardhat-upgrades/dist/utils";
import { ContractFactory, Signer } from "ethers";
import { getUpgradeInterfaceVersion } from "@openzeppelin/upgrades-core";
import debug from 'debug';

import { Context } from "./Context";
import { required, requiredEnv } from '../configuration';
import { ProxyCiService } from './ProxyCiService';
import { EtherscanVerifierAdapter } from './EtherscanVerifierAdapter';
import { sendTxWithRetry } from '../sendTxWithRetry';

export const needUseSafe = () => process.env.SAFE_WALLET_DEPLOY === 'true'

/**
 * Extends basic functionality of @openzepplin/hardhat-upgrades plugin by creating proposal transaction to upgrade proxy through Gnosis Safe Wallet.
 * Basded on https://github.com/OpenZeppelin/openzeppelin-upgrades/blob/master/packages/plugin-hardhat/src/upgrade-proxy.ts
 * 
 * !important: Do not support call option and admin contracts.
 */
export class SafeProxyCiService extends ProxyCiService {

    private api: SafeApiKit
    
    private safeAddress: string = requiredEnv('SAFE_WALLET_ADDRESS')

    constructor(
        ctx: Context,
        initArgs: unknown[],
        contractFactory: ContractFactory,
        private verifier: EtherscanVerifierAdapter,
        upgradeOptions?: UpgradeOptions,
        logger: debug.Debugger = debug(SafeProxyCiService.name)
    ) {
        super(ctx, initArgs, contractFactory, upgradeOptions, logger)

        this.api = new SafeApiKit({
            chainId: BigInt(required(
                this.ctx.hre.network.config.chainId,
                `Provided hardnat network "${this.ctx.hre.network.name}" configuration missing chainId`
            )),
            txServiceUrl: process.env.SAFE_TX_SERVICE_URL, // optional
        })
    }

    static async initSafe(
        ctx: Context,
        initArgs: unknown[],
        verifier: EtherscanVerifierAdapter,
        upgradeOptions?: UpgradeOptions,
    ) {
        return new SafeProxyCiService(
            ctx,
            initArgs,
            await ctx.hre.ethers.getContractFactory(ctx.contractName),
            verifier,
            upgradeOptions,
        )
    }

    private async getSafeWallet(signer: Signer): Promise<{ signerAddress: string, wallet: Safe }> {
        // TODO: switch to abstract names, without prefix BSC 
        // currently hard to do, because hardhat automaically use them for wrong network configuration

        return {
            signerAddress: await signer.getAddress(),
            wallet: await Safe.init({
                provider: requiredEnv('BSC_MAINNET_RPC_URL'),
                signer: requiredEnv('BSC_MAINNET_PRIVATE_KEY'),
                safeAddress: this.safeAddress
            })
        }
    }

    public async deployProxy(): Promise<string> {
        const address = await super.deployProxy()
        
        this.log(`Transfer ownership to the Safe Wallet ${this.safeAddress}...`)
        const proxy = await this.hre.ethers.getContractAt(this.contractName, address)
        // expect that the contract implements Ownable interface
        if (!proxy.transferOwnership) {
            throw new Error(`Contract ${this.contractName} at address ${address} does not implement transferOwnership method, usally defined in Ownable base contract`)
        }
        await sendTxWithRetry(async () => await proxy.transferOwnership(this.safeAddress!))
        this.log(`Ownership transfered to ${this.safeAddress}`)

        return address
    }

    async upgradeProxy(proxyAddress: string): Promise<void> {

        const { impl: nextImpl } = await deployProxyImpl(this.hre, this.contractFactory, this.upgradeOptions, proxyAddress);
        this.log(`Deployed new implementation contract at address ${nextImpl}. Till transaction approve, this implementaion not will be verified, so will do it in advance`)
        await this.verifier.verifyIfNeeded(nextImpl, this.upgradeOptions.constructorArgs || []) 

        const signer = getSigner(this.contractFactory.runner)
        // upgrade kind is inferred above
        const txData = await this.encodeUpgradeCall(proxyAddress, nextImpl, this.upgradeOptions, signer);

        if(!signer) 
            throw new Error(`Signer for contract of proxy "${proxyAddress}" is undefined not defined`)
        
        const {signerAddress, wallet} = await this.getSafeWallet(signer)
        this.log(`Retrived Safe wallet with address ${await wallet.getAddress()} and signer: "${signerAddress}"`)

        const tx = await wallet.createTransaction({
            transactions: [{
                to: proxyAddress,
                value: '0',
                data: txData
            }]
        })

        // Deterministic hash based on transaction parameters
        const txHash = await wallet.getTransactionHash(tx)
        this.log(`Prepared upgrade transaction with hash ${txHash}`)

        // Sign transaction to verify that the transaction is coming from current owner
        const sign = await wallet.signHash(txHash)

        await this.api.proposeTransaction({
            safeAddress: this.safeAddress,
            safeTransactionData: tx.data,
            safeTxHash: txHash,
            senderAddress: signerAddress,
            senderSignature: sign.data,
        })

        console.log(`Upgrade proposal transaction for proxy ${proxyAddress} has been created`)
    }

    async encodeUpgradeCall(proxyAddress: string, nextImpl: string, opts: UpgradeProxyOptions, signer?: Signer) {
        const { provider } = this.hre.network;
        const upgradeInterfaceVersion = await getUpgradeInterfaceVersion(provider, proxyAddress, this.logger);

        const overrides = opts.txOverrides ? [opts.txOverrides] : [];

        switch (upgradeInterfaceVersion) {
            case '5.0.0': {
                const proxy = await attachITransparentUpgradeableProxyV5(this.hre, proxyAddress, signer);
                // 0x for call fallback
                return proxy.interface.encodeFunctionData('upgradeToAndCall', [nextImpl, '0x', ...overrides]);
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
                return proxy.interface.encodeFunctionData('upgradeTo', [nextImpl, ...overrides]);
            }
        }
    }
}