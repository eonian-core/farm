import React from "react";
import { useAppSelector } from "../../store/hooks";
import {
  formatNumberCompactWithThreshold,
  FractionPartView,
} from "../../shared/humanize";
import { Tooltip } from "@nextui-org/react";
import { toStringNumberFromDecimals } from "../../shared";

interface Props extends Omit<React.HTMLProps<HTMLSpanElement>, "value"> {
  value: bigint;
  decimals: number;
  threshold?: bigint;
  fractionDigits?: number;
  fractionPartView?: FractionPartView;
}

const CompactNumber: React.FC<Props> = ({
  value,
  decimals,
  threshold,
  fractionDigits,
  fractionPartView,
  ...restProps
}) => {
  const locale = useAppSelector((state) => state.locale.current);

  const formattedValue = formatNumberCompactWithThreshold(value, decimals, {
    threshold,
    fractionDigits,
    fractionPartView,
    locale,
  });

  return (
    <Tooltip content={toStringNumberFromDecimals(value, decimals)}>
      <span {...restProps}>{formattedValue}</span>
    </Tooltip>
  );
};

export default React.memo(CompactNumber);
