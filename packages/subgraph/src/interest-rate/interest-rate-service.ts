import { Address, Bytes, ethereum, BigInt } from "@graphprotocol/graph-ts";
import { InterestRate } from "../../generated/schema"
import {ILogger, WithLogger} from '../logger'
import { Context } from "../Context";
import { IRewardApyService } from "../apy/reward-apy-service";
import { InterestRateSide, InterestRateType, rateSideToString, rateTypeToString } from "./types";

export interface IInterestRateService {
    createOrUpdate(contractAddress: Address, interestRatePerBlock: BigInt, side: InterestRateSide, type: InterestRateType): InterestRate;
}

export class InterestRateService extends WithLogger implements IInterestRateService {

    constructor(
        ctx: Context, 
        logger: ILogger, 
        public apyService: IRewardApyService
    ) {
        super(ctx, logger);
    }

    /** 
     * Creates new interest rate entity if it not exsits 
     * or update it in another case 
     * */
    createOrUpdate(contractAddress: Address, interestRatePerBlock: BigInt, side: InterestRateSide, type: InterestRateType): InterestRate {
        const id = genId(contractAddress, side, type);
        let entity = InterestRate.load(id);
        if(!entity) {
            this.logger.info("Creating new InterestRate entity for {}", [id.toString()])
            entity = new InterestRate(id);
        }

        this.logger.info("Filling InterestRate entity for {}", [id.toString()])
        entity.perBlock = interestRatePerBlock; 
        entity.side = rateSideToString(side);
        entity.type = rateTypeToString(type);

        entity.apy = this.apyService.createOrUpdate(id, interestRatePerBlock).id;

        entity.save()

        return entity;
    }


}

export function genId(contractAddress: Address, side: InterestRateSide, type: InterestRateType): Bytes {
    return Bytes.fromUTF8(contractAddress.toHexString() + '-' + rateSideToString(side) + '-' + rateTypeToString(type))
}


