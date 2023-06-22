import { Address, Bytes, ethereum } from "@graphprotocol/graph-ts";
import { DependencyContainer } from "./dependency-container"

/** Build dependencies and run hooks */
export function runApp(eventName: string, event: ethereum.Event): void {
    const container = new DependencyContainer(eventName, event)

    container.vaultService.createOrUpdateVault(event.address)
}