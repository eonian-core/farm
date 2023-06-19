import { Address, Bytes, BigInt, log, BigDecimal, ethereum } from "@graphprotocol/graph-ts";
import { Vault } from "../generated/Vault/Vault"
import {ERC20} from "../generated/Vault/ERC20"
import { Vault as VaultEntity, Token } from "../generated/schema"

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

/** Creates or updates Vault entity */
export function updateVaultState(contractAddress: Address, event: ethereum.Event ): void {
    const vault = Vault.bind(contractAddress)
    const id = Bytes.fromHexString(contractAddress.toHexString())

    let entity = VaultEntity.load(id)
    if (entity == null) {
        entity = new VaultEntity(id)

        // unchangable data need setup only once
        entity.decimals = vault.decimals()

        // create vault token as ERC20 standard
        getOrCreateToken(contractAddress);
    }

    // create underliyng token
    let asset = vault.try_asset();
    if (asset.reverted) {
        // Asset can not exists before first initialization
        warn("[updateVaultState] vault.asset() call reverted", contractAddress, event)
    } else {
        entity.asset = getOrCreateToken(asset.value).id;
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

/** Creates and saves the new token */
export function getOrCreateToken(contractAddress: Address): Token {
    const id = Bytes.fromHexString(contractAddress.toHexString())
    let token = Token.load(id);
    if(token) {
        return token;
    }

    // not exsits, need create
    token = new Token(id);
    const contract = ERC20.bind(contractAddress)

    token.address = contractAddress.toHexString();
    token.name = contract.name();
    token.symbol = contract.symbol();
    token.decimals = contract.decimals();

    token.save()
 
    return token
}