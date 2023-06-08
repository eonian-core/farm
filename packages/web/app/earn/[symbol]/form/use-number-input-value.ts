import React from "react";

export const useNumberInputValue = (
  defaultValue: number
): [number, string, (value: number | string) => void] => {
  const [value, setValue] = React.useState(defaultValue);
  const [displayValue, setDisplayValue] = React.useState(value + "");

  const handleValueChange = React.useCallback(
    (value: string | number) => {
      const newValue = String(value).replaceAll(",", ".");
      const valid = newValue.match(/^[0-9]*\.?[0-9]*$/);
      if (!valid) {
        return;
      }

      // Perhaps later we can consider to use some big decimal library for this.
      const numberValue = parseFloat(newValue);
      const safeValue = isNaN(numberValue) ? 0 : numberValue;
      setDisplayValue(newValue);
      setValue(safeValue);
    },
    [setValue, setDisplayValue]
  );

  return [value, displayValue, handleValueChange];
};
