import {
    assert,
    describe,
    test,
    clearStore,
    beforeAll,
    afterAll,
    createMockedFunction,
    afterEach,
} from "matchstick-as/assembly/index"
import { Address, ethereum } from "@graphprotocol/graph-ts"
import { mockViewFunction } from "./mocking"
import { createUpgradedEvent } from "./vault-utils";
import { getOrCreateToken } from "../src/Token";

const tokenAddress = Address.fromString("0xAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA");
const tokenAddressStr = tokenAddress.toHexString()

export function mockTokenContract(token: Address): void {
    // Mock the contract call for getting the name
    mockViewFunction(token, "name", "string", [ethereum.Value.fromString("USD Tether")])
    // Mock the contract call for getting the symbol
    mockViewFunction(token, "symbol", "string", [ethereum.Value.fromString("USDT")])
    // Mock the contract call for getting the decimals
    mockViewFunction(token, "decimals", "uint8", [ethereum.Value.fromI32(18)])

}

describe("getOrCreateToken", () => {
    beforeAll(() => {
        mockTokenContract(tokenAddress)
    })

    afterAll(() => {
        clearStore()
    })

    test("should create Token", () => {
        let implementationAddress = Address.fromString(
            "0x0000000000000000000000000000000000000001"
        )

        let newUpgradedEvent = createUpgradedEvent(implementationAddress)

        getOrCreateToken(tokenAddress, newUpgradedEvent)

        assert.entityCount("Token", 1)

        assert.fieldEquals("Token", tokenAddressStr, "name", "USD Tether")
        assert.fieldEquals("Token", tokenAddressStr, "symbol", "USDT")
        assert.fieldEquals("Token", tokenAddressStr, "decimals", "18")
    })

    test("should get Token", () => {
        let implementationAddress = Address.fromString(
            "0x0000000000000000000000000000000000000001"
        )

        let newUpgradedEvent = createUpgradedEvent(implementationAddress)

        // Mock the contract call for getting the name
        mockViewFunction(tokenAddress, "name", "string", [ethereum.Value.fromString("qqq")])
        // Mock the contract call for getting the symbol
        mockViewFunction(tokenAddress, "symbol", "string", [ethereum.Value.fromString("eee")])
        // Mock the contract call for getting the decimals
        mockViewFunction(tokenAddress, "decimals", "uint8", [ethereum.Value.fromI32(28)])

        getOrCreateToken(tokenAddress, newUpgradedEvent)

        assert.entityCount("Token", 1)

        // shuldnt be updated
        assert.fieldEquals("Token", tokenAddressStr, "name", "USD Tether")
        assert.fieldEquals("Token", tokenAddressStr, "symbol", "USDT")
        assert.fieldEquals("Token", tokenAddressStr, "decimals", "18")
    })

})