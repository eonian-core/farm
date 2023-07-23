import { Address, Bytes } from "@graphprotocol/graph-ts";

export function toId(address: Address): Bytes {
    return Bytes.fromHexString(address.toHexString())
}
