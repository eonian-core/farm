import debug from 'debug'
import type { HardhatRuntimeEnvironment } from 'hardhat/types'

export class Context {
    constructor(
        public hre: HardhatRuntimeEnvironment,
        public contractName: string,
        public deploymentId: string | null,
    ) { }
}

export class WithContext {
    constructor(
        public ctx: Context
    ) { }

    get hre() { return this.ctx.hre; }
    get contractName() { return this.ctx.contractName; }
    get deploymentId() { return this.ctx.deploymentId; }
}


export class WithLogger extends WithContext {
    constructor(
        ctx: Context,
        protected logger: debug.Debugger,
    ) { 
        super(ctx)
    }

    /**
     * Prints the debug message using specified logger.
     */
    protected log(...message: Array<any>) {
        this.logger(`[${this.ctx.contractName}.${this.ctx.deploymentId}]`, ...message)
    }
}