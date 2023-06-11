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
import { Address, ethereum, BigInt} from "@graphprotocol/graph-ts"
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

function mockVault(): void {
    // Mock the contract call for getting the name
    createMockedFunction(defaultAddress, "name", "name():(string)")
      .withArgs([])
      .returns([ethereum.Value.fromString("USDT Vault")])
    // Mock the contract call for getting the symbol
    createMockedFunction(defaultAddress, "symbol", "symbol():(string)")
      .withArgs([])
      .returns([ethereum.Value.fromString("eonUSDT")])
    // Mock the contract call for getting the version
    createMockedFunction(defaultAddress, "version", "version():(string)")
      .withArgs([])
      .returns([ethereum.Value.fromString("0.1.0")])
}

// TODO: try to use test invariant
function testVault(): void {
  assert.fieldEquals(
    "Vault",
    vaultAddress,
    "name",
    "USDT Vault"
  )
  assert.fieldEquals(
    "Vault",
    vaultAddress,
    "symbol",
    "eonUSDT"
  )
  assert.fieldEquals(
    "Vault",
    vaultAddress,
    "version",
    "0.1.0"
  )
}

describe("AdminChanged", () => {
  beforeAll(() => {
    mockVault()
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
    testVault();

    // More assert options:
    // https://thegraph.com/docs/en/developer/matchstick/#asserts
  })
})

describe("Upgraded", () => {
  beforeAll(() => {
    mockVault()
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
    testVault();
  })
})