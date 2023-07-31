import {
    assert,
    describe,
    test,
    clearStore,
    beforeAll,
    afterAll,
    createMockedFunction,
    afterEach,
    beforeEach,
    dataSourceMock,
} from "matchstick-as/assembly/index"
import { Address, ethereum, BigInt, Bytes, log } from "@graphprotocol/graph-ts"
import { createUpgradedEvent } from "./vault-utils";
import { VaultService } from "../src/vault-service";
import { MockLogger, defaultAddress, mockViewFunction } from "./mocking";
import { TokenService } from "../src/token-service";
import { Context } from "../src/Context";
import { mockTokenContract } from "./mock-token";
import { tokenAddress, mockVaultContract, vaultAddress, tokenAddressStr } from "./mock-vault";
import { IInterestRateService } from "../src/interest-rate/interest-rate-service";
import { MockInterestRateService } from "./mock-interest-rate";
import { IPriceService, PriceService } from "../src/price/price-service";
import { mockPriceFeed, MockPriceSerivce } from "./mock-price";

const USDT_PRICE_FEED = Address.fromString(
  "0xB97Ad0E74fa7d920791E90258A6E2085088b4320"
);

let implementationAddress: Address
let event: ethereum.Event
let tokenService: TokenService
let priceService: IPriceService
let interestService: IInterestRateService
let service: VaultService

describe("VaultService", () => {
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
        priceService = new PriceService(ctx, logger);
        tokenService = new TokenService(ctx, logger, priceService);
        interestService = new MockInterestRateService()
        service = new VaultService(ctx, logger, priceService, tokenService, interestService)
    })

    afterAll(() => {
        clearStore()
    })

    describe("createOrUpdateVault", () => {
        beforeAll(() => {
            dataSourceMock.setNetwork("bsc");
            mockPriceFeed(USDT_PRICE_FEED);
            mockVaultContract(defaultAddress)
        })

        afterAll(() => {
            clearStore()
        })

        test("should create Vault", () => {

            service.createOrUpdateVault(defaultAddress)

            assert.entityCount("Vault", 1)

            assert.fieldEquals("Vault", vaultAddress, "name", "USDT Vault")
            assert.fieldEquals("Vault", vaultAddress, "symbol", "eonUSDT")
            assert.fieldEquals("Vault", vaultAddress, "version", "0.1.0")
            assert.fieldEquals("Vault", vaultAddress, "decimals", "18")
            assert.fieldEquals("Vault", vaultAddress, "totalSupply", "100000000000000000000")
            assert.fieldEquals("Vault", vaultAddress, "totalDebt", "50000000000000000000")
            assert.fieldEquals("Vault", vaultAddress, "totalAssets", "60000000000000000000")
            assert.fieldEquals("Vault", vaultAddress, "fundAssets", "70000000000000000000")
            assert.fieldEquals("Vault", vaultAddress, "maxBps", "10000")
            assert.fieldEquals("Vault", vaultAddress, "debtRatio", "5000")
            assert.fieldEquals("Vault", vaultAddress, "lastReportTimestamp", "123");
            assert.fieldEquals("Vault", vaultAddress, "asset", tokenAddressStr);
            assert.fieldEquals("Vault", vaultAddress, "totalUtilisationRate", "555");
            assert.fieldEquals("Vault", vaultAddress, "rates", "[" + Bytes.fromHexString(vaultAddress + "-LENDER-VARIABLE-321").toHexString() + "]");
            
            // (2.5 * (1e8) * 70000000000000000000) / 1e18 = 17500000000
            assert.fieldEquals("Vault", vaultAddress, "fundAssetsUSD", "17500000000");


            assert.entityCount("Token", 2)

            assert.fieldEquals("Token", vaultAddress, "name", "USDT Vault")
            assert.fieldEquals("Token", vaultAddress, "symbol", "eonUSDT")
            assert.fieldEquals("Token", vaultAddress, "decimals", "18")

            assert.fieldEquals("Token", tokenAddressStr, "name", "USD Tether")
            assert.fieldEquals("Token", tokenAddressStr, "symbol", "USDT")
            assert.fieldEquals("Token", tokenAddressStr, "decimals", "18")
        })

        test("should update Vault", () => {

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
            // Mock the contract call for getting the totalAssets
            mockViewFunction(defaultAddress, "totalAssets", "uint256", [ethereum.Value.fromSignedBigInt(BigInt.fromString('90000000000000000000'))])
            // Mock the contract call for getting the fundAssets
            mockViewFunction(defaultAddress, "fundAssets", "uint256", [ethereum.Value.fromSignedBigInt(BigInt.fromString('100000000000000000000'))])
            // Mock the contract call for getting the debtRatio
            mockViewFunction(defaultAddress, "debtRatio", "uint256", [ethereum.Value.fromSignedBigInt(BigInt.fromI64(9000))])
            // Mock the contract call for getting the lastReportTimestamp
            mockViewFunction(defaultAddress, "lastReportTimestamp", "uint256", [ethereum.Value.fromSignedBigInt(BigInt.fromI64(234))])
            // Mock the contract call for getting the interestRatePerBlock
            mockViewFunction(defaultAddress, "interestRatePerBlock", "uint256,uint256", [
                ethereum.Value.fromSignedBigInt(BigInt.fromI64(444)), 
                ethereum.Value.fromSignedBigInt(BigInt.fromI64(666))
            ])

            // Mock the contract call for getting the name
            mockViewFunction(tokenAddress, "name", "string", [ethereum.Value.fromString("qqq")])
            // Mock the contract call for getting the symbol
            mockViewFunction(tokenAddress, "symbol", "string", [ethereum.Value.fromString("eee")])
            // Mock the contract call for getting the decimals
            mockViewFunction(tokenAddress, "decimals", "uint8", [ethereum.Value.fromI32(28)])


            service.createOrUpdateVault(defaultAddress)

            assert.entityCount("Vault", 1)

            assert.fieldEquals("Vault", vaultAddress, "name", "aaa")
            assert.fieldEquals("Vault", vaultAddress, "symbol", "bbb")
            assert.fieldEquals("Vault", vaultAddress, "version", "0.2.0")
            assert.fieldEquals("Vault", vaultAddress, "decimals", "18") // shuldnt be updated
            assert.fieldEquals("Vault", vaultAddress, "totalSupply", "200000000000000000000")
            assert.fieldEquals("Vault", vaultAddress, "totalDebt", "80000000000000000000")
            assert.fieldEquals("Vault", vaultAddress, "totalAssets", "90000000000000000000")
            assert.fieldEquals("Vault", vaultAddress, "fundAssets", "100000000000000000000")
            assert.fieldEquals("Vault", vaultAddress, "maxBps", "10000")
            assert.fieldEquals("Vault", vaultAddress, "debtRatio", "9000")
            assert.fieldEquals("Vault", vaultAddress, "lastReportTimestamp", "234");
            assert.fieldEquals("Vault", vaultAddress, "asset", tokenAddressStr);
            assert.fieldEquals("Vault", vaultAddress, "totalUtilisationRate", "666");
            assert.fieldEquals("Vault", vaultAddress, "rates", "[" + Bytes.fromHexString(vaultAddress + "-LENDER-VARIABLE-444").toHexString() + "]");

            // (2.5 * (1e8) * 100000000000000000000) / 1e18 = 25000000000
            assert.fieldEquals("Vault", vaultAddress, "fundAssetsUSD", "25000000000");
            
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

})