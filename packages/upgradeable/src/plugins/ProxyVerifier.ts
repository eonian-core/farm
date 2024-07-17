import debug from "debug";
import { Context, WithLogger } from "./Context";
import { ProxyCiService } from "./ProxyCiService";
import { EtherscanVerifierAdapter } from "./EtherscanVerifierAdapter";
import { timeout } from "../sendTxWithRetry";

/** Etherscan verifier for proxy and conntected iomplementation contract */
export class ProxyVerifier extends WithLogger {

    constructor(
        ctx: Context,
        private proxy: ProxyCiService,
        private etherscan: EtherscanVerifierAdapter,
    ) {
        super(ctx, debug(ProxyVerifier.name))
    }

    /** 
     * Will try to deploy code and license data to Etherscan for proxy and connected implementation.
     * Do not throw exception if failed, only return false
     * @returns boolean, will be true if successful
     * */
    public async verifyProxyAndImplIfNeeded(proxyAddress: string, constructorArgs: unknown[]): Promise<boolean | undefined> {
        this.log(`Will try to deploy source code and license data to Etherscan for proxy "${proxyAddress}" and connected implementation...`)
        if (this.etherscan.isVerificationDisabled()) {
            return false
        }

        if (await this.isProxyAndImplVerified(proxyAddress)) {
            this.log('No need to verify, contract are already verified!')
            return false
        }

        const isVerified = async () => {
            this.log(`Will wait for ${this.etherscan.safetyDelay}ms till verification is tracked by etherscan, and check if it was successful...`)
            await timeout(this.etherscan.safetyDelay)
            return await this.isProxyAndImplVerified(proxyAddress) ?? false
        }

        const message = await this.etherscan.verifyWithRetry(proxyAddress, constructorArgs, isVerified)

        if (!(await isVerified())) {
            console.log('Verification was not successful!', message)
            return false
        }

        this.log(`Proxy and implementation for "${proxyAddress}" have been verified on etherscan!`)
        return true
    }

    private async isProxyAndImplVerified(proxyAddress: string): Promise<boolean | undefined> {
        const isProxyVerified = await this.etherscan.isContractVerified(proxyAddress)
        if (!isProxyVerified) {
            this.log(`Proxy ${proxyAddress} is not verified or cannot be check on etherscan!`)
            return false
        }

        const implementationAddress = await this.proxy.getImplementation(proxyAddress)
        const isImpltVerified = await this.etherscan.isContractVerified(implementationAddress)
        if (!isImpltVerified) {
            this.log(`Implementation ${implementationAddress} is not verified or cannot be check on etherscan!`)
            return false
        }

        this.log(`Proxy ${proxyAddress} and implementation ${implementationAddress} are verified on etherscan!`)
        return true
    }

}