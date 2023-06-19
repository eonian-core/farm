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
import { AdminChanged } from "../generated/schema"
import { AdminChanged as AdminChangedEvent } from "../generated/Vault/Vault"
import { handleAdminChanged, handleUpgraded } from "../src/vault"
import { createAdminChangedEvent, createUpgradedEvent } from "./vault-utils"

// Tests structure (matchstick-as >=0.5.0)
// https://thegraph.com/docs/en/developer/matchstick/#tests-structure-0-5-0

// Hardcoded in matchstic but not exported :(
// can cause failed tests if will be changed in library
const defaultAddress = Address.fromString("0xA16081F360e3847006dB660bae1c6d1b2e17eC2A");
const vaultAddress = defaultAddress.toHexString()

const tokenAddress = Address.fromString("0xAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA");
const tokenAddressStr = tokenAddress.toHexString()

function mockViewFunction(contractAddress: Address, name: string, resultType: string, resultValue: ethereum.Value[]): void {
  createMockedFunction(contractAddress, name, name + "():(" + resultType + ")")
    .withArgs([])
    .returns(resultValue)
}

function mockVault(vault: Address): void {
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
  mockToken(tokenAddress)
}

function mockToken(token: Address): void {
  // Mock the contract call for getting the name
  mockViewFunction(token, "name", "string", [ethereum.Value.fromString("USD Tether")])
  // Mock the contract call for getting the symbol
  mockViewFunction(token, "symbol", "string", [ethereum.Value.fromString("USDT")])
  // Mock the contract call for getting the decimals
  mockViewFunction(token, "decimals", "uint8", [ethereum.Value.fromI32(18)])

}

// TODO: try to use test invariant
function testVault(vault: string, token: string): void {
  assert.fieldEquals("Vault", vault, "name", "USDT Vault")
  assert.fieldEquals("Vault", vault, "symbol", "eonUSDT")
  assert.fieldEquals("Vault", vault, "version", "0.1.0")
  assert.fieldEquals("Vault", vault, "decimals", "18")
  assert.fieldEquals("Vault", vault, "totalSupply", "100")
  assert.fieldEquals("Vault", vault, "totalDebt", "50000000000000000000")
  assert.fieldEquals("Vault", vault, "maxBps", "10000")
  assert.fieldEquals("Vault", vault, "debtRatio", "0.5")
  assert.fieldEquals("Vault", vault, "lastReportTimestamp", "123");
  assert.fieldEquals("Vault", vault, "asset", token);

  assert.fieldEquals("Token", vault, "name", "USDT Vault")
  assert.fieldEquals("Token", vault, "symbol", "eonUSDT")
  assert.fieldEquals("Token", vault, "decimals", "18")

  testToken(token)
}

function testToken(token: string): void {
  assert.fieldEquals("Token", token, "name", "USD Tether")
  assert.fieldEquals("Token", token, "symbol", "USDT")
  assert.fieldEquals("Token", token, "decimals", "18")
}

describe("AdminChanged", () => {
  beforeAll(() => {
    mockVault(defaultAddress)
  })

  afterAll(() => {
    clearStore()
  })

  // For more test scenarios, see:
  // https://thegraph.com/docs/en/developer/matchstick/#write-a-unit-test

  test("created and stored", () => {
    let previousAdmin = Address.fromString(
      "0x0000000000000000000000000000000000000001"
    )
    let newAdmin = Address.fromString(
      "0x0000000000000000000000000000000000000001"
    )

    let newAdminChangedEvent = createAdminChangedEvent(previousAdmin, newAdmin)
    handleAdminChanged(newAdminChangedEvent)

    assert.entityCount("AdminChanged", 1)

    // 0xa16081f360e3847006db660bae1c6d1b2e17ec2a is the default address used in newMockEvent() function
    assert.fieldEquals(
      "AdminChanged",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a01000000",
      "previousAdmin",
      "0x0000000000000000000000000000000000000001"
    )
    assert.fieldEquals(
      "AdminChanged",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a01000000",
      "newAdmin",
      "0x0000000000000000000000000000000000000001"
    )

    // must be inside test block
    testVault(vaultAddress, tokenAddressStr);

    // More assert options:
    // https://thegraph.com/docs/en/developer/matchstick/#asserts
  })
})

describe("Upgraded", () => {
  beforeAll(() => {
    mockVault(defaultAddress)
  })

  afterAll(() => {
    clearStore()
  })

  test("event created and stored correctly", () => {
    let implementationAddress = Address.fromString(
      "0x0000000000000000000000000000000000000001"
    )

    let newUpgradedEvent = createUpgradedEvent(implementationAddress)

    handleUpgraded(newUpgradedEvent)

    assert.entityCount("Upgraded", 1)

    // 0xa16081f360e3847006db660bae1c6d1b2e17ec2a is the default address used in newMockEvent() function
    assert.fieldEquals(
      "Upgraded",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a01000000",
      "implementation",
      "0x0000000000000000000000000000000000000001"
    )

    assert.fieldEquals(
      "Upgraded",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a01000000",
      "version",
      "0.1.0"
    )

    // must be inside test block
    testVault(vaultAddress, tokenAddressStr);
  })
})