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

/** Creates or updates Vault entity */
export function updateVaultState(contractAddress: Address, event: ethereum.Event ): void {
    const vault = Vault.bind(contractAddress)
    const id = Bytes.fromHexString(contractAddress.toHexString())

    let entity = VaultEntity.load(id)
    if (entity == null) {
        info("[updateVaultState] Creating new Vault entity for {}", [contractAddress.toHexString()], contractAddress, event)
        entity = new VaultEntity(id)

        // unchangable data need setup only once
        entity.decimals = vault.decimals()

        // create vault token as ERC20 standard
        getOrCreateToken(contractAddress, event);
    }

    info("Creating new underling asset token for {}", [contractAddress.toHexString()], contractAddress, event)
    let asset = vault.try_asset();
    if (asset.reverted) {
        // Asset can not exists before first initialization
        warn("[updateVaultState] vault.asset() call reverted", contractAddress, event)
        entity.asset = Bytes.empty();
    } else {
        entity.asset = getOrCreateToken(asset.value, event).id;
    }

    info("[updateVaultState] Filling vault entity for {}", [contractAddress.toHexString()], contractAddress, event)

    entity.address = contractAddress.toHexString()
    entity.name = vault.name()
    entity.symbol = vault.symbol()
    entity.version = vault.version();

    debug('[updateVaultState] vault cotnract state {} {} {} {}', [contractAddress.toHexString(), vault.name(), vault.symbol(), vault.version()], contractAddress, event)
    debug('[updateVaultState] vault entity state {} {} {} {}', [entity.address, entity.name, entity.symbol, entity.version], contractAddress, event)

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
export function getOrCreateToken(contractAddress: Address, event: ethereum.Event): Token {
    const id = Bytes.fromHexString(contractAddress.toHexString())
    let token = Token.load(id);
    if(token) {
        return token;
    }

    info("[getOrCreateToken] Creating new token entity for {}", [contractAddress.toHexString()], contractAddress, event)
    token = new Token(id);
    const contract = ERC20.bind(contractAddress)

    info("[getOrCreateToken] Filling token entity for {}", [contractAddress.toHexString()], contractAddress, event)
    token.address = contractAddress.toHexString();
    token.name = contract.name();
    token.symbol = contract.symbol();
    token.decimals = contract.decimals();

    debug('[getOrCreateToken] token contract state {} {} {}', [contractAddress.toHexString(), contract.name(), contract.symbol()], contractAddress, event)
    debug('[getOrCreateToken] token entity state {} {} {}', [token.address, token.name, token.symbol], contractAddress, event)

    token.save()
 
    return token
}