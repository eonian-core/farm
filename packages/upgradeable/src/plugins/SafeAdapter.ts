import debug from "debug";
import { Context, WithLogger } from "./Context";
import SafeApiKit from "@safe-global/api-kit";
import { required, requiredEnv } from "../configuration";
import { BaseContract, Contract, FunctionFragment, Signer } from "ethers";
import Safe, { SigningMethod } from "@safe-global/protocol-kit";


export function makeSafeApiKit(ctx: Context): SafeApiKit {
    return new SafeApiKit({
        chainId: BigInt(required(
            ctx.hre.network.config.chainId,
            `Provided hardnat network "${ctx.hre.network.name}" configuration missing chainId`
        )),
        txServiceUrl: process.env.SAFE_TX_SERVICE_URL, // optional
    })
}

export interface SafeWalletContainer {
    address: string
    getWallet: () => Promise<Safe>
}

export function makeSafeWalletProvider(): SafeWalletContainer {
    const walletAddress = requiredEnv('SAFE_WALLET_ADDRESS')
    const signer = requiredEnv('BSC_MAINNET_PRIVATE_KEY')
    const provider = requiredEnv('BSC_MAINNET_RPC_URL')

    return {
        address: walletAddress,
        getWallet: async () => await Safe.init({
            provider,
            signer,
            safeAddress: walletAddress
        })
    }
}

export class SafeAdapter extends WithLogger {

    private api: SafeApiKit
    
    public walletAddress: string 

    private generateWallet: () => Promise<Safe>

    constructor(ctx: Context, api: SafeApiKit, walletContainer: SafeWalletContainer) {
        super(ctx, debug(SafeAdapter.name));

        this.api = api
        this.walletAddress = walletContainer.address
        // Hard to setup wallet during sync execution, because it async
        // so we need to generate wallet on demand
        this.generateWallet = walletContainer.getWallet
    }

    public async getSafeWallet(signer: Signer): Promise<{ signerAddress: string, wallet: Safe }> {
        const [signerAddress, wallet] = await Promise.all([
            signer.getAddress(),
            this.generateWallet()
        ])
        return {
            signerAddress,
            wallet
        }
    }

    async proposeTransaction(address: string, contract: BaseContract, fragment: FunctionFragment | string, values: ReadonlyArray<any>, signer: Signer) {
        this.log(`Proposing transaction for address: "${address}" with fragment: "${fragment}" and values: "${values}"`)

        const txData = contract.interface.encodeFunctionData(fragment, values);
        this.log('Transaction data encoded')

        this.log(`Retiving safe wallet for signer: "${signer}"...`)
        const {signerAddress, wallet} = await this.getSafeWallet(signer)
        this.log(`Retrived Safe wallet with address ${await wallet.getAddress()} and signer: "${signerAddress}"`)

        const nextNonce = await this.api.getNextNonce(this.walletAddress)
        this.log(`Will propose new transaction with nonce ${nextNonce}`)

        const tx = await wallet.createTransaction({
            transactions: [{
                to: address,
                value: '0',
                data: txData
            }],
            options: {
                // by default api proposes transactions without checking for transaction in the queue
                // as a result all transactions will have same nonce and only one can be executed
                nonce: nextNonce
            }
        })

        // Deterministic hash based on transaction parameters
        const txHash = await wallet.getTransactionHash(tx)
        this.log(`Prepared safe transaction with hash ${txHash}`)

        this.log('Sign transaction to verify that the transaction is coming from the owner:', signerAddress)
        const sign = await wallet.signTransaction(tx, SigningMethod.ETH_SIGN_TYPED_DATA_V4)

        const signatureData = sign.getSignature(signerAddress)?.data
        if (!signatureData)
            throw new Error(`Failed to get signature for address: "${signerAddress}"`)

        await this.api.proposeTransaction({
            safeAddress: this.walletAddress,
            safeTransactionData: tx.data,
            safeTxHash: txHash,
            senderAddress: signerAddress,
            senderSignature: signatureData,
        })

        console.log(`Safe transaction with nonce ${nextNonce} for address: "${address}" has been proposed, tx hash: ${txHash}`)

        return {tx, txData, txHash}
    }
}