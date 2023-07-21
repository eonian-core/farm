import {
    assert,
    describe,
    test,
    clearStore,
    beforeEach,
    afterAll,
    beforeAll,
} from "matchstick-as/assembly/index"
import { Address, ethereum } from "@graphprotocol/graph-ts"
import { MockLogger, mockViewFunction } from "./mocking"
import { createUpgradedEvent } from "./vault-utils";
import { TokenService } from "../src/token-service";
import { Context } from "../src/Context";
import { mockTokenContract } from "./mock-token";

const tokenAddress = Address.fromString(
  "0xAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"
);
const tokenAddressStr = tokenAddress.toHexString()


let implementationAddress: Address
let event: ethereum.Event
let service: TokenService

describe("TokenService", () => {
    beforeAll(() => {
        mockTokenContract(tokenAddress)
    })

    beforeEach(() => {
        implementationAddress = Address.fromString(
            "0x0000000000000000000000000000000000000001"
        )
        event = createUpgradedEvent(implementationAddress)
        const ctx = new Context(event, 'test')
        const logger = new MockLogger()
        service = new TokenService(ctx, logger)
    })

    afterAll(() => {
        clearStore()
    })

    describe("getOrCreateToken", () => {

        test("should create Token", () => {

            const token = service.getOrCreateToken(tokenAddress)

            assert.stringEquals(token.name, "USD Tether")
            assert.stringEquals(token.symbol, "USDT")
            assert.i32Equals(token.decimals, 18)

            assert.entityCount("Token", 1)

            assert.fieldEquals("Token", tokenAddressStr, "name", "USD Tether")
            assert.fieldEquals("Token", tokenAddressStr, "symbol", "USDT")
            assert.fieldEquals("Token", tokenAddressStr, "decimals", "18")
        })

        test("should get Token", () => {

            // Mock the contract call for getting the name
            mockViewFunction(tokenAddress, "name", "string", [ethereum.Value.fromString("qqq")])
            // Mock the contract call for getting the symbol
            mockViewFunction(tokenAddress, "symbol", "string", [ethereum.Value.fromString("eee")])
            // Mock the contract call for getting the decimals
            mockViewFunction(tokenAddress, "decimals", "uint8", [ethereum.Value.fromI32(28)])

            const token = service.getOrCreateToken(tokenAddress)

            assert.stringEquals(token.name, "USD Tether")
            assert.stringEquals(token.symbol, "USDT")
            assert.i32Equals(token.decimals, 18)

            assert.entityCount("Token", 1)

            // shuldnt be updated
            assert.fieldEquals("Token", tokenAddressStr, "name", "USD Tether")
            assert.fieldEquals("Token", tokenAddressStr, "symbol", "USDT")
            assert.fieldEquals("Token", tokenAddressStr, "decimals", "18")
        })

    })
})