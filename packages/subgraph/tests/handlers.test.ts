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
import { handleAdminChanged, handleUpgraded } from "../src/handlers"
import { createAdminChangedEvent, createUpgradedEvent } from "./vault-utils"
import { defaultAddress, mockVaultContract } from "./Vault.test"

// Tests structure (matchstick-as >=0.5.0)
// https://thegraph.com/docs/en/developer/matchstick/#tests-structure-0-5-0



describe("AdminChanged", () => {
  beforeAll(() => {
    mockVaultContract(defaultAddress)
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

    assert.entityCount("Vault", 1)
    assert.entityCount("Token", 2)
  })
})

describe("Upgraded", () => {
  beforeAll(() => {
    mockVaultContract(defaultAddress)
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
    assert.entityCount("Vault", 1)
    assert.entityCount("Token", 2)
  })
})
