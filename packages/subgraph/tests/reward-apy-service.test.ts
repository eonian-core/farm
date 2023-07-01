import {
    assert,
    describe,
    test,
    clearStore,
    beforeEach,
    afterAll,
    beforeAll,
    afterEach,
} from "matchstick-as/assembly/index"
import { Address, ethereum, BigInt, Bytes} from "@graphprotocol/graph-ts"
import { MockLogger, mockViewFunction } from "./mocking"
import { createUpgradedEvent } from "./vault-utils";
import { Context } from "../src/Context";
import { RewardApyService } from "../src/apy/reward-apy-service";
import { MAX_BPS } from "../src/apy/apy-calculations";

const tokenAddress = Address.fromString("0xAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA");
const tokenAddressStr = tokenAddress.toHexString()

const idStr = "0x0000000000000000000000000000000000000001"
const id = Bytes.fromHexString(idStr);

let implementationAddress: Address
let event: ethereum.Event
let service: RewardApyService

describe("RewardApyService", () => {

    beforeEach(() => {
        implementationAddress = Address.fromString(
            "0x0000000000000000000000000000000000000001"
        )
        event = createUpgradedEvent(implementationAddress)
        const ctx = new Context(event, 'test')
        const logger = new MockLogger()
        service = new RewardApyService(ctx, logger)
    })

    afterAll(() => {
        clearStore()
    })

    describe("createOrUpdate", () => {

        test("should create APY entity", () => {
            const interestRatePerBlock = BigInt.fromI64(123);

            const entity = service.createOrUpdate(id, interestRatePerBlock)

            assert.bytesEquals(entity.id, id)

            assert.entityCount("RewardAPY", 1)

            assert.fieldEquals("RewardAPY", idStr, "decimals", MAX_BPS.toString())
            assert.fieldEquals("RewardAPY", idStr, "dayly", "353403600")
            assert.fieldEquals("RewardAPY", idStr, "weekly", "22391510400")
            assert.fieldEquals("RewardAPY", idStr, "monthly", "95963616000")
            assert.fieldEquals("RewardAPY", idStr, "yearly", "1167557328000")

        })

        test("should update APY entity", () => {

            const interestRatePerBlock = BigInt.fromI64(246);

            const entity = service.createOrUpdate(id, interestRatePerBlock)

            assert.bytesEquals(entity.id, id)

            assert.entityCount("RewardAPY", 1)

            assert.fieldEquals("RewardAPY", idStr, "decimals", MAX_BPS.toString())
            assert.fieldEquals("RewardAPY", idStr, "dayly", "706807200")
            assert.fieldEquals("RewardAPY", idStr, "weekly", "44783020800")
            assert.fieldEquals("RewardAPY", idStr, "monthly", "191927232000")
            assert.fieldEquals("RewardAPY", idStr, "yearly", "2335114656000")
        })

    })
})