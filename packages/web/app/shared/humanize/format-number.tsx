/**
 * Returns formatted value with compact notation if it's greater then {@link threshold}.
 * @param value The value to format.
 * @param threshold Minimum value to format.
 * @param fractionDigits Number of digits after the decimal point. Must be in the range 0 - 20, inclusive.
 * @param locale The locale that is used for formatting.
 * @returns Formatted value.
 */
export const formatNumberCompactWithThreshold = (
  value: number,
  threshold?: number,
  fractionDigits?: number,
  locale?: string
): string => {
  const fractionedValue = fractionDigits
    ? value.toFixed(fractionDigits)
    : String(value);

  if (threshold && value < threshold) {
    return fractionedValue;
  }

  const compactValue = formatNumberCompact(value, locale);
  if (String(value) === compactValue) {
    return fractionedValue;
  }

  return compactValue;
};

export const formatNumberCompact = (value: number, locale = "en", maxValue = 1e16): string => {
  value = Math.min(value, maxValue);
  const formatter = Intl.NumberFormat(locale, { notation: "compact" });
  const formattedValue = formatter.format(value);
  return value === maxValue ? `>${formattedValue}` : formattedValue;
};

/**
 * Provides string representation of the specified number.
 * Unlike "toString()", it helps to avoid converting to numbers with scientific notation.
 * @param value The value to convert.
 * @param decimals The decimals points.
 * @returns String representation of a number.
 */
export const numberToString = (value: number, decimals: number): string => {
  const stringValue = String(value);
  if (stringValue.includes("e")) {
    if (value < 1) {
      return value.toFixed(decimals);
    } else {
      return value.toLocaleString("fullwide", { useGrouping: false });
    }
  }
  return stringValue;
}
