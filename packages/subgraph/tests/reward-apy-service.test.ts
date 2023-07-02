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
import { INTEREST_RATE_DECIMALS } from "../src/apy/apy-calculations";

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

            assert.fieldEquals("RewardAPY", idStr, "decimals", INTEREST_RATE_DECIMALS.toString())
            assert.fieldEquals("RewardAPY", idStr, "daily", "353403600")
            assert.fieldEquals("RewardAPY", idStr, "weekly", "2471439000")
            assert.fieldEquals("RewardAPY", idStr, "monthly", "10591899000")
            assert.fieldEquals("RewardAPY", idStr, "yearly", "128868034800")
        })

        test("should update APY entity", () => {

            const interestRatePerBlock = BigInt.fromI64(246);

            const entity = service.createOrUpdate(id, interestRatePerBlock)

            assert.bytesEquals(entity.id, id)

            assert.entityCount("RewardAPY", 1)

            assert.fieldEquals("RewardAPY", idStr, "decimals", INTEREST_RATE_DECIMALS.toString())
            assert.fieldEquals("RewardAPY", idStr, "daily", "706807200")
            assert.fieldEquals("RewardAPY", idStr, "weekly", "4942878000")
            assert.fieldEquals("RewardAPY", idStr, "monthly", "21183798000")
            assert.fieldEquals("RewardAPY", idStr, "yearly", "257736069600")
        })

    })
})