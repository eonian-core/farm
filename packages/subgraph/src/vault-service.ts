import { Address, Bytes, BigInt, log, BigDecimal, ethereum } from "@graphprotocol/graph-ts";
import { Vault } from "../generated/Vault/Vault"
import { Vault as VaultEntity, Token } from "../generated/schema"
import {ILogger, Logger, WithLogger} from './logger'
import { TokenService } from "./token-service";
import { Context } from "./Context";
import { toId } from "./types/id";
import { IInterestRateService } from "./interest-rate/interest-rate-service";
import { InterestRateSide, InterestRateType } from "./interest-rate/types";


export class VaultService extends WithLogger {
    constructor(
        ctx: Context, 
        logger: ILogger, 
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

            // unchangable data need setup only once
            entity.decimals = vault.decimals()

            // create vault token as ERC20 standard
            this.tokenService.getOrCreateToken(contractAddress);
        }

        this.logger.info("Creating new underling asset token for {}", [contractAddress.toHexString()])
        let asset = vault.try_asset();
        if (asset.reverted) {
            // Asset can not exists before first initialization
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
        entity.maxBps = vault.MAX_BPS();
        entity.debtRatio = vault.debtRatio()
        entity.lastReportTimestamp = vault.lastReportTimestamp();

        const interestAndUtilisation = vault.interestRatePerBlock();
        entity.totalUtilisationRate = interestAndUtilisation.getValue1();

        entity.rates = [this.interestService.createOrUpdate(
            contractAddress,
            interestAndUtilisation.getValue0(), // interest rate
            InterestRateSide.Lender,
            InterestRateType.Variable // expect compund like interest rate
        ).id];

        entity.save()
    }
}



