import { ethers } from 'ethers'

/**
 * Converts normal number value to BigInt with decimals representation.
 * @param value The value to convert.
 * @param decimals The decimals value of the number.
 * @returns A big integer value.
 */
export function toBigIntWithDecimals(value: number | string, decimals: number): bigint {
  return ethers.parseUnits(value.toString(), decimals)
}

/**
 * Transforms big number with decimals to normal JavaScript number.
 * @param value The value to transform.
 * @param decimals The decimals value of the big number.
 * @returns A number value.
 */
export function toStringNumberFromDecimals(value: bigint | string, decimals: number): string {
  return ethers.formatUnits(value, decimals)
}
