import { Vault } from "../../api";

export const calculateVaultAPY = (
  vault: Vault,
  blocksPerDay = 28800
): number => calculateAPY(
    vault.rates[0].perBlock,
    vault.asset.decimals,
    blocksPerDay
  );

export const calculateAPY = (
  interestRatePerBlock: bigint | number,
  decimals: number,
  blocksPerDay: number
): number => {
  const mantissa = Math.pow(10, decimals);
  const dailyReward =
    (Number(interestRatePerBlock) / mantissa) * blocksPerDay + 1;
  return (Math.pow(dailyReward, 365) - 1) * 100;
};
