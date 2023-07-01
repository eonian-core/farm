import { Address, Bytes, ethereum, BigInt } from "@graphprotocol/graph-ts";

export const MAX_BPS = 4;
export const INTEREST_RATE_DECIMALS = 18;
export const PERCENTS_SCALE = BigInt.fromI64(100);

// TODO: add values per chain
// Average data for BSC
export const BLOCKS_PER_DAY = BigInt.fromI64(28732); // Based on https://ycharts.com/indicators/binance_smart_chain_blocks_per_day
export const BLOCK_TIME = 3.01; // In seconds, https://ycharts.com/indicators/binance_smart_chain_average_block_time

export const SECONDS_PER_DAY: f64 = 60 * 60 * 24;

export const BLOCKS_PER_WEEK = BigInt.fromI64(Math.round((7 as f64) * SECONDS_PER_DAY / BLOCK_TIME) as i64);
export const BLOCKS_PER_MONTH = BigInt.fromI64(Math.round((30 as f64) * SECONDS_PER_DAY / BLOCK_TIME) as i64);
export const BLOCKS_PER_YEAR = BigInt.fromI64(Math.round((365 as f64) * SECONDS_PER_DAY / BLOCK_TIME) as i64);

/**
 * Returns APY in percents scaled by 10 ^ 18
 * @param interestRatePerBlock interest rate per block scaled by 10 ^ 18
 * @param blocksAmount amount of blocks in period, example per day:
 * @returns APY in percents scaled by 10 ^ 18
 * */ 
export function toApy(interestRatePerBlock: BigInt, blocksAmount: BigInt): BigInt {
    return interestRatePerBlock.times(blocksAmount).times(PERCENTS_SCALE)
}