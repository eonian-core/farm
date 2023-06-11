import { Address, Bytes } from "@graphprotocol/graph-ts";
import {
    Vault
} from "../generated/Vault/Vault"
import {
    Vault as VaultEntity
} from "../generated/schema"

export function updateVaultState(contractAddress: Address): void {
    let vault = Vault.bind(contractAddress)
    const id = Bytes.fromHexString(contractAddress.toHexString())

    let entity = VaultEntity.load(id)
    if (entity == null) {
        entity = new VaultEntity(id)
    }

    entity.address = contractAddress.toHexString()
    entity.name = vault.name()
    entity.symbol = vault.symbol()
    entity.version = vault.version();

    entity.save()
}