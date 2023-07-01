import React from "react";
import { toBigIntWithDecimals, toNumberFromDecimals } from "../../../shared";

export const useNumberInputValue = (
  defaultValue: bigint,
  decimals: number
): [number, string, bigint, (value: number | string) => void] => {
  const [bigValue, setBigValue] = React.useState(defaultValue);
  const [value, setValue] = React.useState(
    toNumberFromDecimals(bigValue, decimals)
  );
  const [displayValue, setDisplayValue] = React.useState(value + "");

  const handleValueChange = React.useCallback(
    (value: string | number) => {
      const newValue = normalizeValue(value);
      const isValid = validate(newValue, decimals);
      if (!isValid) {
        return;
      }

      const numberValue = parseFloat(newValue);
      const isNumber = !isNaN(numberValue);
      setDisplayValue(newValue);
      setValue(isNumber ? numberValue : 0);
      setBigValue(isNumber ? toBigIntWithDecimals(newValue, decimals) : 0n);
    },
    [decimals]
  );

  return [value, displayValue, bigValue, handleValueChange];
};

function normalizeValue(value: string | number): string {
  return String(value)
    .replaceAll(",", ".") // Transforms a comma to a dot.
    .replace(/^(0+)([0-9]+.*)/g, "$2"); // Removes extra leading zeros from the input.
}

function validate(value: string, decimals: number): boolean {
  if (!value) {
    return true;
  }

  const validators = [
    validateNumber,
    validateRange,
    validateFractionPartLength,
  ];
  return validators.every((validator) => {
    return validator(value, decimals);
  });
}

function validateNumber(value: string) {
  return !!value.match(/^[0-9]*\.?[0-9]*$/);
}

/**
 * Tries to cast a number to BigInt with specified decimals.
 */
function validateRange(value: string, decimals: number) {
  try {
    toBigIntWithDecimals(value, decimals);
  } catch (error) {
    return false;
  }
  return true;
}

/**
 * Since the ending zeros in the fractional part are ignored by the range validator,
 * the length of the value can be inflated.
 * E.g. "0.01" number is invalid (if decimals = 1), but "0.01000" is considered as a valid number.
 */
function validateFractionPartLength(value: string, decimals: number) {
  const parts = value.split(".");
  if (parts.length !== 2) {
    return true;
  }
  const [, fractionPart] = parts;
  return !fractionPart.endsWith("0") || fractionPart.length <= decimals;
}