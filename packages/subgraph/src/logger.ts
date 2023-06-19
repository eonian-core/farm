import { Address, log, ethereum } from "@graphprotocol/graph-ts";

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
