import debug from 'debug'
import type { HardhatRuntimeEnvironment } from 'hardhat/types'

export class Context {
    constructor(
        protected logger: debug.Debugger,
        protected hre: HardhatRuntimeEnvironment,
        protected contractName: string,
        protected deploymentId: string | null,
    ) { }


    /**
     * Prints the debug message using specified logger.
     */
    protected log(...message: Array<any>) {
        this.logger(`[${this.contractName}.${this.deploymentId}]`, ...message)
    }

}