export function toUSDValue(amount: bigint, decimals: number, price: bigint): bigint {
  const mantissa = 10n ** BigInt(decimals)
  return (amount * price) / mantissa
}
