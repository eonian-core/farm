import type { Vault } from '../../api'

export function calculateVaultAPY(vault: Vault, precision = 10000): number {
  const mantissa = 10n ** BigInt(vault.asset.decimals)
  const scaled = vault.rates[0].apy.yearly * BigInt(precision)
  return Number(scaled / mantissa) / precision
}

export function calculateAPY(interestRatePerBlock: bigint | number, decimals: number, blocksPerDay: number): number {
  const mantissa = 10 ** decimals
  const dailyReward = (Number(interestRatePerBlock) / mantissa) * blocksPerDay + 1
  return (dailyReward ** 365 - 1) * 100
}
