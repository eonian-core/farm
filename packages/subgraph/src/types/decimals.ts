import { BigInt, BigDecimal } from "@graphprotocol/graph-ts";

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
