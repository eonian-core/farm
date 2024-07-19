import debug from "debug";
import { Context, WithLogger } from "./Context";
import SafeApiKit from "@safe-global/api-kit";
import { required, requiredEnv } from "../configuration";
import { BaseContract, Contract, FunctionFragment, Signer } from "ethers";
import Safe from "@safe-global/protocol-kit";

export class SafeAdapter extends WithLogger {

    private api: SafeApiKit
    
    public walletAddress: string = requiredEnv('SAFE_WALLET_ADDRESS')

    constructor(ctx: Context) {
        super(ctx, debug(SafeAdapter.name));

        this.api = new SafeApiKit({
            chainId: BigInt(required(
                this.ctx.hre.network.config.chainId,
                `Provided hardnat network "${this.ctx.hre.network.name}" configuration missing chainId`
            )),
            txServiceUrl: process.env.SAFE_TX_SERVICE_URL, // optional
        })
    }

    private async getSafeWallet(signer: Signer): Promise<{ signerAddress: string, wallet: Safe }> {
        // TODO: switch to abstract names, without prefix BSC 
        // currently hard to do, because hardhat automaically use them for wrong network configuration

        return {
            signerAddress: await signer.getAddress(),
            wallet: await Safe.init({
                provider: requiredEnv('BSC_MAINNET_RPC_URL'),
                signer: requiredEnv('BSC_MAINNET_PRIVATE_KEY'),
                safeAddress: this.walletAddress
            })
        }
    }

    async proposeTransaction(address: string, contract: BaseContract, fragment: FunctionFragment | string, values: ReadonlyArray<any>, signer: Signer) {
        this.log(`Proposing transaction for address: "${address}" with fragment: "${fragment}" and values: "${values}"`)

        const txData = contract.interface.encodeFunctionData(fragment, values);
        this.log('Transaction data encoded')

        this.log(`Retiving safe wallet for signer: "${signer}"...`)
        const {signerAddress, wallet} = await this.getSafeWallet(signer)
        this.log(`Retrived Safe wallet with address ${await wallet.getAddress()} and signer: "${signerAddress}"`)

        const tx = await wallet.createTransaction({
            transactions: [{
                to: address,
                value: '0',
                data: txData
            }]
        })

        // Deterministic hash based on transaction parameters
        const txHash = await wallet.getTransactionHash(tx)
        this.log(`Prepared safe transaction with hash ${txHash}`)

        // Sign transaction to verify that the transaction is coming from current owner
        const sign = await wallet.signHash(txHash)

        await this.api.proposeTransaction({
            safeAddress: this.walletAddress,
            safeTransactionData: tx.data,
            safeTxHash: txHash,
            senderAddress: signerAddress,
            senderSignature: sign.data,
        })

        console.log(`Safe transaction for address: "${address}" has been proposed`)

        return {tx, txData, txHash}
    }
}