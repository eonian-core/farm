import { Address, Bytes, BigInt, log, BigDecimal, ethereum } from "@graphprotocol/graph-ts";

export function toId(address: Address): Bytes {
    return Bytes.fromHexString(address.toHexString())
}
