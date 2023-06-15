export const denominateTokenValue = (value: string | bigint, decimals: string | bigint): number => {
    const bigIntValue = BigInt(value);
    const bigIntDecimals = BigInt(decimals);
    return Number(bigIntValue / 10n ** bigIntDecimals)
}
