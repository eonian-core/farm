import { BigInt } from "@graphprotocol/graph-ts";
import { BigDecimal } from "@graphprotocol/graph-ts";

export const INTEREST_RATE_DECIMALS = 18;

// TODO: add values per chain
// Average data for BSC
export const BLOCKS_PER_DAY = BigInt.fromI64(28732); // Based on https://ycharts.com/indicators/binance_smart_chain_blocks_per_day

/**
 * Calculates APY scaled to 100%.
 * @param interestRatePerBlock The interest rate per block scaled by "decimals".
 * @param decimals The decimals of the "interestRatePerBlock".
 * @returns APY in percents.
 * */
export function toAPY(interestRatePerBlock: BigInt, decimals: i32): BigInt {
  const mantissa = Math.pow(10, decimals);
  const interestRate = (interestRatePerBlock.toI64() as f64) / mantissa;
  const blocksPerDay = BLOCKS_PER_DAY.toI64() as f64;
  const dailyReward = (interestRate * blocksPerDay + 1) as f64;
  const result = (Math.pow(dailyReward, 365) - 1) * mantissa;
  return BigInt.fromI64(result as i64).times(BigInt.fromI32(100));
}