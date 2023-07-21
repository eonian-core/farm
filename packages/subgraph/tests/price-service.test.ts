import {
  assert,
  describe,
  test,
  clearStore,
  beforeEach,
  afterAll,
  beforeAll,
  afterEach,
  dataSourceMock,
} from "matchstick-as/assembly/index";
import { Address, BigInt, ethereum } from "@graphprotocol/graph-ts";
import { MockLogger, mockViewFunction } from "./mocking";
import { createUpgradedEvent } from "./vault-utils";
import { TokenService } from "../src/token-service";
import { Context } from "../src/Context";
import { mockTokenContract } from "./mock-token";
import { PriceService } from "../src/price/price-service";
import { mockPriceFeed } from "./mock-price";

const tokenAddress = Address.fromString(
  "0xAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"
);

let implementationAddress: Address;
let event: ethereum.Event;
let service: PriceService;

describe("TokenService (Price Feed)", () => {
  beforeEach(() => {
    mockTokenContract(tokenAddress);
  });

  beforeEach(() => {
    implementationAddress = Address.fromString(
      "0x0000000000000000000000000000000000000001"
    );
    event = createUpgradedEvent(implementationAddress);
    const ctx = new Context(event, "test");
    const logger = new MockLogger();
    service = new PriceService(ctx, logger);
  });

  afterEach(() => {
    clearStore();
  });

  test("should create price (BSC)", () => {
    dataSourceMock.setNetwork("bsc");

    const USDT_PRICE_FEED = Address.fromString(
      "0xB97Ad0E74fa7d920791E90258A6E2085088b4320"
    );
    mockPriceFeed(USDT_PRICE_FEED);

    const price = service.createOrUpdate("USDT", tokenAddress);
    assert.i32Equals(price.decimals, 8);
    assert.bigIntEquals(price.value, BigInt.fromI64(256));
  });

  test("should create price (Sepolia)", () => {
    dataSourceMock.setNetwork("sepolia");

    const USDT_PRICE_FEED = Address.fromString(
      "0xA2F78ab2355fe2f984D808B5CeE7FD0A93D5270E"
    );
    mockPriceFeed(USDT_PRICE_FEED);

    const price = service.createOrUpdate("USDT", tokenAddress);
    assert.i32Equals(price.decimals, 8);
    assert.bigIntEquals(price.value, BigInt.fromI64(256));
  });

  test("should create price with 0 value if network is not supported", () => {
    dataSourceMock.setNetwork("unknown");

    const USDT_PRICE_FEED = Address.fromString(
      "0xA2F78ab2355fe2f984D808B5CeE7FD0A93D5270E"
    );
    mockPriceFeed(USDT_PRICE_FEED);

    const price = service.createOrUpdate("USDT", tokenAddress);
    assert.i32Equals(price.decimals, 0);
    assert.bigIntEquals(price.value, BigInt.zero());
  });

  test("should create price with 0 value if token is not supported", () => {
    dataSourceMock.setNetwork("bsc");

    const USDT_PRICE_FEED = Address.fromString(
      "0xA2F78ab2355fe2f984D808B5CeE7FD0A93D5270E"
    );
    mockPriceFeed(USDT_PRICE_FEED);

    const price = service.createOrUpdate("UNSUPPORTED_SYMBOL", tokenAddress);
    assert.i32Equals(price.decimals, 0);
    assert.bigIntEquals(price.value, BigInt.zero());
  });
  
  test("should create price with 0 value if token is a vault share", () => {
    dataSourceMock.setNetwork("bsc");
    dataSourceMock.setAddress(tokenAddress.toHexString());

    const USDT_PRICE_FEED = Address.fromString(
      "0xB97Ad0E74fa7d920791E90258A6E2085088b4320"
    );
    mockPriceFeed(USDT_PRICE_FEED);

    const price = service.createOrUpdate("USDT", tokenAddress);
    assert.i32Equals(price.decimals, 0);
    assert.bigIntEquals(price.value, BigInt.zero());
  });
});
