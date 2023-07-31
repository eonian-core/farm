import { Address, ethereum } from "@graphprotocol/graph-ts";
import { mockViewFunction } from "./mocking"

export function mockTokenContract(token: Address): void {
    // Mock the contract call for getting the name
    mockViewFunction(token, "name", "string", [ethereum.Value.fromString("USD Tether")])
    // Mock the contract call for getting the symbol
    mockViewFunction(token, "symbol", "string", [ethereum.Value.fromString("USDT")])
    // Mock the contract call for getting the decimals
    mockViewFunction(token, "decimals", "uint8", [ethereum.Value.fromI32(18)])
}
