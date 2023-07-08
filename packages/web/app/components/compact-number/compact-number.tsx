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
  tooltipContent = (value) => value,
}) => {
  const locale = useAppSelector((state) => state.locale.current);

  const formattedValue = formatNumberCompactWithThreshold(value, decimals, {
    threshold,
    fractionDigits,
    fractionPartView,
    locale,
  });

  const accurateValue = toStringNumberFromDecimals(value, decimals);
  return (
    <Tooltip className={className} content={tooltipContent(accurateValue)}>
      {childrenAtStart && children}
      <span>{formattedValue}</span>
      {!childrenAtStart && children}
    </Tooltip>
  );
};

export default React.memo(CompactNumber);
