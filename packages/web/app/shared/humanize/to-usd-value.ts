export function toUSDValue(
  amount: bigint,
  decimals: number,
  price: bigint
): bigint {
  const mantissa = 10n ** BigInt(decimals);
  return (amount * BigInt(price)) / mantissa;
}
