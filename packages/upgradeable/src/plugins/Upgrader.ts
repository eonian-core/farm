import SafeApiKit from '@safe-global/api-kit'
import Safe, { SafeFactory } from '@safe-global/protocol-kit'
import { ContractAddressOrInstance, UpgradeProxyOptions, getContractAddress, deployProxyImpl, getSigner, attach, attachITransparentUpgradeableProxyV5, attachITransparentUpgradeableProxyV4, UpgradeOptions } from "@openzeppelin/hardhat-upgrades/dist/utils";
import { Contract, ContractFactory, Signer } from "ethers";
import { getUpgradeInterfaceVersion } from "@openzeppelin/upgrades-core";
import debug from 'debug';
import { HardhatRuntimeEnvironment } from 'hardhat/types';

import { Context } from "./Context";
import { SafeTransaction } from '@safe-global/safe-core-sdk-types';
/** Check if environmetn variable defined, or throw exception othervise */
const requiredEnv = (name: string): string =>
    required(process.env[name], `Environment variable "${name}" is not defined`)

/** Check if variable defined, or throw exception othervise */
const required = <T>(value: T | undefined | null, failMessage: string): T => {
    if (value === undefined || value === null) {
        throw new Error(failMessage)
    }
    return value
}

/**
 * Extends basic functionality of @openzepplin/hardhat-upgrades plugin by creating proposal transaction to upgrade proxy through Gnosis Safe Wallet.
 * Basded on https://github.com/OpenZeppelin/openzeppelin-upgrades/blob/master/packages/plugin-hardhat/src/upgrade-proxy.ts
 * 
 * !important: Do not support call option and admin contracts.
 */
export class SafeUpgrade extends Context {

    private api: SafeApiKit
    
    private safeAddress: string = requiredEnv('SAFE_WALLET_ADDRESS')

    constructor(
        hre: HardhatRuntimeEnvironment,
        contractName: string,
        deploymentId: string | null,
        private initArgs: unknown[],
        private upgradeOptions: UpgradeOptions = { constructorArgs: [true] }, // Disable initializers
    ) {
        super(debug(SafeUpgrade.name), hre, contractName, deploymentId)
        this.upgradeOptions = {
            kind: 'uups',
            redeployImplementation: 'onchange',
            ...this.upgradeOptions,
        }

        this.api = new SafeApiKit({
            chainId: BigInt(required(
                hre.network.config.chainId,
                `Provided hardnat network "${hre.network.name}" configuration missing chainId`
            )),
            txServiceUrl: process.env.SAFE_TX_SERVICE_URL, // optional
        })
    }

    private async getSafeWallet(signer?: Signer): Promise<{ signerAddress: string, wallet: Safe }> {
        // TODO: switch to abstract names, without prefix BSC 
        // currently hard to do, because hardhat automaically use them for wrong network configuration
        const signerAddress = (await signer?.getAddress()) ?? requiredEnv('BSC_MAINNET_PRIVATE_KEY')
        return {
            signerAddress,
            wallet: await Safe.init({
                provider: requiredEnv('BSC_MAINNET_RPC_URL'),
                signer: signerAddress,
                safeAddress: this.safeAddress
            })
        }
    }

    async upgradeProxy(proxyAddress: string, ImplFactory: ContractFactory, opts: UpgradeProxyOptions = {}): Promise<SafeTransaction> {

        const { impl: nextImpl } = await deployProxyImpl(this.hre, ImplFactory, opts, proxyAddress);
        const signer = getSigner(ImplFactory.runner)
        // upgrade kind is inferred above
        const txData = await this.encodeUpgradeCall(proxyAddress, nextImpl, opts, signer);

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

        this.log(`Upgrade proposal transaction for proxy ${proxyAddress} has been created`)

        return tx
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