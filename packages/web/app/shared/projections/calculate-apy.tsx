import { Vault } from '../../api';

export const calculateVaultAPY = (vault: Vault, precision = 10000): number => {
  const mantissa = 10n ** BigInt(vault.asset.decimals);
  const scaled = vault.rates[0].apy.yearly * BigInt(precision);
  return Number(scaled / mantissa) / precision;
};

export const calculateAPY = (interestRatePerBlock: bigint | number, decimals: number, blocksPerDay: number): number => {
  const mantissa = Math.pow(10, decimals);
  const dailyReward = (Number(interestRatePerBlock) / mantissa) * blocksPerDay + 1;
  return (Math.pow(dailyReward, 365) - 1) * 100;
};
