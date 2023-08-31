import { Address, Bytes, BigInt } from "@graphprotocol/graph-ts";
import { Vault, Vault__interestRatePerBlockResult } from "../generated/Vault/Vault"
import { Vault as VaultEntity } from "../generated/schema"
import {ILogger, WithLogger} from './logger'
import { TokenService } from "./token-service";
import { IPriceService } from "./price/price-service";
import { Context } from "./Context";
import { toId } from "./types/id";
import { IInterestRateService } from "./interest-rate/interest-rate-service";
import { InterestRateSide, InterestRateType } from "./interest-rate/types";

export class VaultService extends WithLogger {
    constructor(
        ctx: Context, 
        logger: ILogger,
        public priceService: IPriceService,
        public tokenService: TokenService, 
        public interestService: IInterestRateService
    ) {
        super(ctx, logger);
    }

    /** Creates or updates Vault entity */
    createOrUpdateVault(contractAddress: Address): void {
        const vault = Vault.bind(contractAddress)
        const id = toId(contractAddress)

        let entity = VaultEntity.load(id)
        if (entity == null) {
            this.logger.info("Creating new Vault entity for {}", [contractAddress.toHexString()])
            entity = new VaultEntity(id)

            // unchangeable data must be set only once
            entity.decimals = vault.decimals()

            // create vault token as ERC20 standard
            this.tokenService.getOrCreateToken(contractAddress);
        }

        this.logger.info("Creating new underling asset token for {}", [contractAddress.toHexString()])
        let asset = vault.try_asset();
        if (asset.reverted) {
            // Asset can not exist before first initialization
            this.logger.warn("vault.asset() call reverted", [])
            entity.asset = Bytes.empty();
        } else {
            entity.asset = this.tokenService.getOrCreateToken(asset.value).id;
        }

        this.logger.info("Filling vault entity for {}", [contractAddress.toHexString()])

        entity.address = contractAddress.toHexString()
        entity.name = vault.name()
        entity.symbol = vault.symbol()
        entity.version = vault.version();

        this.logger.debug('vault contract state {} {} {}', [contractAddress.toHexString(), vault.name(), vault.symbol()])
        this.logger.debug('vault entity state {} {} {}', [entity.address, entity.name, entity.symbol])

        // totalSupply / decimals = convert int to float
        entity.totalSupply = vault.totalSupply()

        entity.totalDebt = vault.totalDebt();
        entity.totalAssets = vault.totalAssets();
        entity.fundAssets = vault.fundAssets();
        entity.fundAssetsUSD = this.toUSD(entity.fundAssets, asset.value);

        entity.maxBps = vault.MAX_BPS();
        entity.debtRatio = vault.debtRatio()
        entity.lastReportTimestamp = vault.lastReportTimestamp();

        const interestAndUtilisation = this.getInterestRate(vault);
        entity.totalUtilisationRate = interestAndUtilisation.getValue1();

        entity.rates = [this.interestService.createOrUpdate(
            contractAddress,
            interestAndUtilisation.getValue0(), // interest rate
            InterestRateSide.Lender,
            InterestRateType.Variable // expect compund like interest rate
        ).id];

        entity.save()
    }

    getInterestRate(vault: Vault): Vault__interestRatePerBlockResult {
        const interestRatePerBlock = vault.try_interestRatePerBlock();
        if (interestRatePerBlock.reverted) {
            this.logger.warn('Method "Vault.interestRatePerBlock" reverted, vault: {}', [vault.name()])
            return new Vault__interestRatePerBlockResult(BigInt.zero(), BigInt.zero());
        }
        return interestRatePerBlock.value
    }

    toUSD(value: BigInt, tokenContractAddress: Address): BigInt {
        const token = this.tokenService.getOrCreateToken(tokenContractAddress);
        const price = this.priceService.createOrUpdate(token.symbol, tokenContractAddress);
        const mantissa = BigInt.fromI64(10).pow(token.decimals as i8);
        return value.times(price.value).div(mantissa);
    }
}



