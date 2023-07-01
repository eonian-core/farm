import { Address, log, ethereum } from "@graphprotocol/graph-ts";
import { Context, WithContext } from "./Context";

export interface ILogger {

    warn(message: string, args: Array<string>): void 
    info(message: string, args: Array<string>): void 
    debug(message: string, args: Array<string>): void
    error(message: string, args: Array<string>): void
}

export class Logger extends WithContext implements ILogger {

    get loggingContext(): Array<string> {
        return [
            this.contractAddress.toHexString(),
            this.event.transaction.hash.toHexString(),
            this.event.transactionLogIndex.toString(),
        ]
    }

    genMessage(base: string): string {
        return "[" + this.ctx.eventName + "] " + base + " for contract {} tx {}-{}"
    }

    warn(message: string, args: Array<string>): void {
        log.warning(this.genMessage(message), args.concat(this.loggingContext))
    }

    info(message: string, args: Array<string>): void {
        log.info(this.genMessage(message), args.concat(this.loggingContext))
    }

    debug(message: string, args: Array<string>): void {
        log.debug(this.genMessage(message), args.concat(this.loggingContext))
    }

    error(message: string, args: Array<string>): void {
        log.error(this.genMessage(message), args.concat(this.loggingContext))
    }
}

export class WithLogger extends WithContext {

    constructor(ctx: Context, public logger: ILogger) {
        super(ctx);
    }
}


export function warn(message: string, contractAddress: Address, event: ethereum.Event): void {
    log.warning(
        message + " for contract {} tx {}-{}",
        [
            contractAddress.toHexString(),
            event.transaction.hash.toHexString(),
            event.transactionLogIndex.toString(),
        ]
    )
}

export function info(message: string, args: Array<string>, contractAddress: Address, event: ethereum.Event): void {
    log.info(
        message + " for contract {} tx {}-{}",
        args.concat([
            contractAddress.toHexString(),
            event.transaction.hash.toHexString(),
            event.transactionLogIndex.toString(),
        ])
    )
}

export function debug(message: string, args: Array<string>, contractAddress: Address, event: ethereum.Event): void {
    log.debug(
        message + " for contract {} tx {}-{}",
        args.concat([
            contractAddress.toHexString(),
            event.transaction.hash.toHexString(),
            event.transactionLogIndex.toString(),
        ])
    )
}
