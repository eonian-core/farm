import { Address, Bytes, BigInt, log, BigDecimal, ethereum } from "@graphprotocol/graph-ts";
import { Vault } from "../generated/Vault/Vault"
import { Vault as VaultEntity, Token } from "../generated/schema"
import * as logger from './logger'
import { TokenService } from "./Token";

/** Creates or updates Vault entity */
export function createOrUpdateVault(contractAddress: Address, event: ethereum.Event ): void {
    const tokenService = new TokenService(event)
    const vault = Vault.bind(contractAddress)
    const id = Bytes.fromHexString(contractAddress.toHexString())

    let entity = VaultEntity.load(id)
    if (entity == null) {
        logger.info("[updateVaultState] Creating new Vault entity for {}", [contractAddress.toHexString()], contractAddress, event)
        entity = new VaultEntity(id)

        // unchangable data need setup only once
        entity.decimals = vault.decimals()

        // create vault token as ERC20 standard
        tokenService.getOrCreateToken(contractAddress);
    }

    logger.info("Creating new underling asset token for {}", [contractAddress.toHexString()], contractAddress, event)
    let asset = vault.try_asset();
    if (asset.reverted) {
        // Asset can not exists before first initialization
        logger.warn("[updateVaultState] vault.asset() call reverted", contractAddress, event)
        entity.asset = Bytes.empty();
    } else {
        entity.asset = tokenService.getOrCreateToken(asset.value).id;
    }

    logger.info("[updateVaultState] Filling vault entity for {}", [contractAddress.toHexString()], contractAddress, event)

    entity.address = contractAddress.toHexString()
    entity.name = vault.name()
    entity.symbol = vault.symbol()
    entity.version = vault.version();

    logger.debug('[updateVaultState] vault cotnract state {} {} {} {}', [contractAddress.toHexString(), vault.name(), vault.symbol(), vault.version()], contractAddress, event)
    logger.debug('[updateVaultState] vault entity state {} {} {} {}', [entity.address, entity.name, entity.symbol, entity.version], contractAddress, event)

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

