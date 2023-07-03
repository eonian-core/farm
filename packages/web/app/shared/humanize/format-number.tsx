import { toStringNumberFromDecimals } from "../web3";

export enum FractionPartView {
  GREATER_SIGN,
  DOTS,
  CUT,
}

/**
 * Returns formatted value with compact notation if it's greater then {@link threshold}.
 * @param value The value to format.
 * @param decimals The decimals of the value.
 * @param params.threshold If the value exceeds this {@link threshold}, it will be compacted.
 * @param params.fractionDigits Number of digits after the decimal point. Must be in the range 0 - 20, inclusive.
 * @param params.fractionPartView The type of small number compaction.
 * @param params.locale The locale that is used for formatting.
 * @returns Formatted value.
 */
export const formatNumberCompactWithThreshold = (
  value: bigint,
  decimals: number,
  params?: {
    threshold?: bigint;
    fractionDigits?: number;
    fractionPartView?: FractionPartView;
    locale?: string;
  }
): string => {
  const {
    threshold = 0n,
    fractionDigits = 0,
    fractionPartView = FractionPartView.CUT,
    locale,
  } = params ?? {};
  const stringNumber = toStringNumberFromDecimals(value, decimals);

  if (threshold > 0n && value > threshold) {
    return formatNumberCompact(parseFloat(stringNumber), locale);
  }

  if (stringNumber.replace(/\.0$/, "").includes(".") && fractionDigits > 0) {
    const index = stringNumber.indexOf(".");
    const capped = stringNumber.substring(0, index + 1 + fractionDigits);
    const lengthDifference = stringNumber.length - capped.length;

    switch (fractionPartView) {
      case FractionPartView.GREATER_SIGN:
        return lengthDifference > 0 ? ">" + capped : stringNumber;
      case FractionPartView.DOTS: {
        if (lengthDifference > 1) {
          return capped + ".." + stringNumber.slice(-1);
        }
        // The length difference is 1 digit only, so we can return source value in this case.
        if (lengthDifference === 1) {
          return stringNumber;
        }
        return capped;
      }
      case FractionPartView.CUT: {
        if (lengthDifference === 0) {
          return stringNumber;
        }
        const [integerPart, fractionPart] = String(stringNumber).split(".");
        const digits = Math.min(fractionPart.length, fractionDigits);
        return integerPart + "." + fractionPart.slice(0, digits);
      }
    }
  }

  return stringNumber;
};

export const formatNumberCompact = (
  value: number,
  locale = "en",
  maxValue = 1e16
): string => {
  value = Math.min(value, maxValue);
  const formatter = Intl.NumberFormat(locale, { notation: "compact" });
  const formattedValue = formatter.format(value);
  return value === maxValue ? `>${formattedValue}` : formattedValue;
};
