import {  Bytes,  BigInt } from "@graphprotocol/graph-ts";
import {  RewardAPY } from "../../generated/schema"
import {WithLogger} from '../logger'
import { MAX_BPS, BLOCKS_PER_DAY, BLOCKS_PER_WEEK, BLOCKS_PER_MONTH, BLOCKS_PER_YEAR, toApy } from "./apy-calculations";

export interface IRewardApyService {
    createOrUpdate(id: Bytes, interestRatePerBlock: BigInt): RewardAPY;
}

export class RewardApyService extends WithLogger implements IRewardApyService {

    /**
     * Creates new interest rate entity if it not exsits 
     * or update it in another case 
     */
    public createOrUpdate(id: Bytes, interestRatePerBlock: BigInt): RewardAPY {
        let entity = RewardAPY.load(id);
        if(!entity) {
            this.logger.info("Creating new APY entity for {}", [id.toString()])
            entity = new RewardAPY(id);
            entity.decimals = MAX_BPS;
        }

        this.logger.info("Filling APY entity for {}", [id.toString()])
        entity.dayly = toApy(interestRatePerBlock, BLOCKS_PER_DAY);
        entity.weekly = toApy(interestRatePerBlock, BLOCKS_PER_WEEK);
        entity.monthly = toApy(interestRatePerBlock, BLOCKS_PER_MONTH);
        entity.yearly = toApy(interestRatePerBlock, BLOCKS_PER_YEAR);

        entity.save()

        return entity;
    }

}

