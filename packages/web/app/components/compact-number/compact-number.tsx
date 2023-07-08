import React from "react";
import { useAppSelector } from "../../store/hooks";
import {
  formatNumberCompactWithThreshold,
  FractionPartView,
} from "../../shared/humanize";
import { Tooltip } from "@nextui-org/react";
import { toStringNumberFromDecimals } from "../../shared";

interface Props {
  value: bigint;
  decimals: number;
  threshold?: bigint;
  fractionDigits?: number;
  fractionPartView?: FractionPartView;
  className?: string;
  children?: React.ReactNode;
  childrenAtStart?: boolean;
  tooltipContent?: (value: string) => React.ReactNode;
}

const CompactNumber: React.FC<Props> = ({
  value,
  decimals,
  threshold,
  fractionDigits,
  fractionPartView,
  className,
  children,
  childrenAtStart,
  tooltipContent,
}) => {
  const locale = useAppSelector((state) => state.locale.current);

  const formattedValue = formatNumberCompactWithThreshold(value, decimals, {
    threshold,
    fractionDigits,
    fractionPartView,
    locale,
  });

  const accurateValue = toStringNumberFromDecimals(value, decimals);
  const content =
    typeof tooltipContent === "function"
      ? tooltipContent(accurateValue)
      : accurateValue;
  return (
    <Tooltip className={className} content={content}>
      {childrenAtStart && children}
      <span>{formattedValue}</span>
      {!childrenAtStart && children}
    </Tooltip>
  );
};

export default React.memo(CompactNumber);
