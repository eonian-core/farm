import { BigInt } from "@graphprotocol/graph-ts";
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
import { toApy } from "../src/apy/apy-calculations";

// Describe function to group the tests
describe("toApy function", () => {
    // Test case 1
    test("should return the expected APY for a given interest rate and blocks amount", () => {
        const interestRatePerBlock = BigInt.fromI32(10_000); // 1%
        const blocksAmount = BigInt.fromI32(1); // 1 block
        const expectedApy = BigInt.fromI32(100); // 100%

        const result = toApy(interestRatePerBlock, blocksAmount);

        assert.bigIntEquals(result, expectedApy);
    });

    // Test case 2
    test("should return the expected APY for a given interest rate and blocks amount", () => {
        const interestRatePerBlock = BigInt.fromI32(500); // 0.05%
        const blocksAmount = BigInt.fromI32(100); // 100 blocks
        const expectedApy = BigInt.fromI32(50); // 50%

        const result = toApy(interestRatePerBlock, blocksAmount);

        assert.bigIntEquals(result, expectedApy);
    });

    // Test case 3
    test("should return the expected APY for a given interest rate and blocks amount", () => {
        const interestRatePerBlock = BigInt.fromI32(1000); // 0.1%
        const blocksAmount = BigInt.fromI32(365); // 365 blocks
        const expectedApy = BigInt.fromI32(3650); // 3650%

        const result = toApy(interestRatePerBlock, blocksAmount);

        assert.bigIntEquals(result, expectedApy);
    });

    // Test case 4
    test("should return the expected APY for a given interest rate and blocks amount", () => {
        const interestRatePerBlock = BigInt.fromI32(1); // 0.0001%
        const blocksAmount = BigInt.fromI32(1000); // 1000 blocks
        const expectedApy = BigInt.fromI32(0); // 0%

        const result = toApy(interestRatePerBlock, blocksAmount);

        assert.bigIntEquals(result, expectedApy);
    });

    // Test case 5
    test("should return the expected APY for a given interest rate and blocks amount", () => {
        const interestRatePerBlock = BigInt.fromI32(1_000_000); // 100%
        const blocksAmount = BigInt.fromI32(1000_000); // 1 million blocks
        const expectedApy = BigInt.fromI32(10_000_000_000); // 1 billion percent

        const result = toApy(interestRatePerBlock, blocksAmount);

        assert.bigIntEquals(result, expectedApy);
    });
});
