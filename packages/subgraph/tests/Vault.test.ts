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
import { Address, ethereum, BigInt } from "@graphprotocol/graph-ts"
import { createUpgradedEvent } from "./vault-utils";
import { createOrUpdateVault } from "../src/Vault";
import { defaultAddress, mockViewFunction } from "./mocking";
import { mockTokenContract } from "./Token.test";


const vaultAddress = defaultAddress.toHexString()

const tokenAddress = Address.fromString("0xAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA");
const tokenAddressStr = tokenAddress.toHexString()

export function mockVaultContract(vault: Address): void {
  // Mock the contract call for getting the name
  mockViewFunction(vault, "name", "string", [ethereum.Value.fromString("USDT Vault")])
  // Mock the contract call for getting the symbol
  mockViewFunction(vault, "symbol", "string", [ethereum.Value.fromString("eonUSDT")])
  // Mock the contract call for getting the version
  mockViewFunction(vault, "version", "string", [ethereum.Value.fromString("0.1.0")])
  // Mock the contract call for getting the decimals
  mockViewFunction(vault, "decimals", "uint8", [ethereum.Value.fromI32(18)])
  // Mock the contract call for getting the totalSupply
  mockViewFunction(vault, "totalSupply", "uint256", [ethereum.Value.fromSignedBigInt(BigInt.fromString('100000000000000000000'))])
  // Mock the contract call for getting the totalDebt
  mockViewFunction(vault, "totalDebt", "uint256", [ethereum.Value.fromSignedBigInt(BigInt.fromString('50000000000000000000'))])
  // Mock the contract call for getting the MAX_BPS
  mockViewFunction(vault, "MAX_BPS", "uint256", [ethereum.Value.fromSignedBigInt(BigInt.fromI64(10000))])
  // Mock the contract call for getting the debtRatio
  mockViewFunction(vault, "debtRatio", "uint256", [ethereum.Value.fromSignedBigInt(BigInt.fromI64(5000))])
  // Mock the contract call for getting the lastReportTimestamp
  mockViewFunction(vault, "lastReportTimestamp", "uint256", [ethereum.Value.fromSignedBigInt(BigInt.fromI64(123))])
  // Mock the contract call for getting the asset
  mockViewFunction(vault, "asset", "address", [ethereum.Value.fromAddress(tokenAddress)])
  
  mockTokenContract(tokenAddress)
}


describe("createOrUpdateVault", () => {
    beforeAll(() => {
        mockVaultContract(defaultAddress)
    })

    afterAll(() => {
        clearStore()
    })

    test("should create Vault", () => {
        let implementationAddress = Address.fromString(
            "0x0000000000000000000000000000000000000001"
        )

        let newUpgradedEvent = createUpgradedEvent(implementationAddress)

        createOrUpdateVault(defaultAddress, newUpgradedEvent)

        assert.entityCount("Vault", 1)

        assert.fieldEquals("Vault", vaultAddress, "name", "USDT Vault")
        assert.fieldEquals("Vault", vaultAddress, "symbol", "eonUSDT")
        assert.fieldEquals("Vault", vaultAddress, "version", "0.1.0")
        assert.fieldEquals("Vault", vaultAddress, "decimals", "18")
        assert.fieldEquals("Vault", vaultAddress, "totalSupply", "100")
        assert.fieldEquals("Vault", vaultAddress, "totalDebt", "50000000000000000000")
        assert.fieldEquals("Vault", vaultAddress, "maxBps", "10000")
        assert.fieldEquals("Vault", vaultAddress, "debtRatio", "0.5")
        assert.fieldEquals("Vault", vaultAddress, "lastReportTimestamp", "123");
        assert.fieldEquals("Vault", vaultAddress, "asset", tokenAddressStr);
      
        assert.entityCount("Token", 2)

        assert.fieldEquals("Token", vaultAddress, "name", "USDT Vault")
        assert.fieldEquals("Token", vaultAddress, "symbol", "eonUSDT")
        assert.fieldEquals("Token", vaultAddress, "decimals", "18")

        assert.fieldEquals("Token", tokenAddressStr, "name", "USD Tether")
        assert.fieldEquals("Token", tokenAddressStr, "symbol", "USDT")
        assert.fieldEquals("Token", tokenAddressStr, "decimals", "18")
    })

    test("should update Vault", () => {
        let implementationAddress = Address.fromString(
            "0x0000000000000000000000000000000000000001"
        )

        let newUpgradedEvent = createUpgradedEvent(implementationAddress)

        // Mock the contract call for getting the name
        mockViewFunction(defaultAddress, "name", "string", [ethereum.Value.fromString("aaa")])
        // Mock the contract call for getting the symbol
        mockViewFunction(defaultAddress, "symbol", "string", [ethereum.Value.fromString("bbb")])
        // Mock the contract call for getting the version
        mockViewFunction(defaultAddress, "version", "string", [ethereum.Value.fromString("0.2.0")])
        // Mock the contract call for getting the decimals
        mockViewFunction(defaultAddress, "decimals", "uint8", [ethereum.Value.fromI32(36)])
        // Mock the contract call for getting the totalSupply
        mockViewFunction(defaultAddress, "totalSupply", "uint256", [ethereum.Value.fromSignedBigInt(BigInt.fromString('200000000000000000000'))])
        // Mock the contract call for getting the totalDebt
        mockViewFunction(defaultAddress, "totalDebt", "uint256", [ethereum.Value.fromSignedBigInt(BigInt.fromString('80000000000000000000'))])
        // Mock the contract call for getting the debtRatio
        mockViewFunction(defaultAddress, "debtRatio", "uint256", [ethereum.Value.fromSignedBigInt(BigInt.fromI64(9000))])
        // Mock the contract call for getting the lastReportTimestamp
        mockViewFunction(defaultAddress, "lastReportTimestamp", "uint256", [ethereum.Value.fromSignedBigInt(BigInt.fromI64(234))])

        // Mock the contract call for getting the name
        mockViewFunction(tokenAddress, "name", "string", [ethereum.Value.fromString("qqq")])
        // Mock the contract call for getting the symbol
        mockViewFunction(tokenAddress, "symbol", "string", [ethereum.Value.fromString("eee")])
        // Mock the contract call for getting the decimals
        mockViewFunction(tokenAddress, "decimals", "uint8", [ethereum.Value.fromI32(28)])


        createOrUpdateVault(defaultAddress, newUpgradedEvent)

        assert.entityCount("Vault", 1)

        assert.fieldEquals("Vault", vaultAddress, "name", "aaa")
        assert.fieldEquals("Vault", vaultAddress, "symbol", "bbb")
        assert.fieldEquals("Vault", vaultAddress, "version", "0.2.0")
        assert.fieldEquals("Vault", vaultAddress, "decimals", "18") // shuldnt be updated
        assert.fieldEquals("Vault", vaultAddress, "totalSupply", "200")
        assert.fieldEquals("Vault", vaultAddress, "totalDebt", "80000000000000000000")
        assert.fieldEquals("Vault", vaultAddress, "maxBps", "10000")
        assert.fieldEquals("Vault", vaultAddress, "debtRatio", "0.9")
        assert.fieldEquals("Vault", vaultAddress, "lastReportTimestamp", "234");
        assert.fieldEquals("Vault", vaultAddress, "asset", tokenAddressStr);
      
        assert.entityCount("Token", 2)

        // shuldnt be updated
        assert.fieldEquals("Token", vaultAddress, "name", "USDT Vault")
        assert.fieldEquals("Token", vaultAddress, "symbol", "eonUSDT")
        assert.fieldEquals("Token", vaultAddress, "decimals", "18")

        // shuldnt be updated
        assert.fieldEquals("Token", tokenAddressStr, "name", "USD Tether") 
        assert.fieldEquals("Token", tokenAddressStr, "symbol", "USDT")
        assert.fieldEquals("Token", tokenAddressStr, "decimals", "18")
    })

})