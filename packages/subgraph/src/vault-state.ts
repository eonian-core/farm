import { Address, Bytes, BigInt, log, BigDecimal } from "@graphprotocol/graph-ts";
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

        // unchangable data need setup only once
        entity.decimals = vault.decimals()
    }

    entity.address = contractAddress.toHexString()
    entity.name = vault.name()
    entity.symbol = vault.symbol()
    entity.version = vault.version();

    // totalSupply / decimals = convert int to float
    entity.totalSupply = toDecimalWithBasei32(vault.totalSupply(), entity.decimals)

    entity.totalDebt = vault.totalDebt();
    entity.maxBps = vault.MAX_BPS();
    entity.debtRatio = toDecimalWithBaseBigInt(vault.debtRatio(), entity.maxBps)
    entity.lastReportTimestamp = vault.lastReportTimestamp();

    entity.save()
}

export function toDecimalWithBasei32(n: BigInt, decimals: i32): BigDecimal {
    const value = n.toBigDecimal();
    const base = BigInt.fromI64(10).pow(decimals as u8).toBigDecimal()
    
    // BigInt / 10^decimals -> BigDecimal
    return value.div(base)
}

export function toDecimalWithBaseBigInt(n: BigInt, decimals: BigInt): BigDecimal {
    // BigInt / 10^decimals -> BigDecimal
    return n.toBigDecimal().div(decimals.toBigDecimal())
}