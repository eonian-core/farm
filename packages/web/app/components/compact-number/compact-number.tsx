import React from "react";
import { useAppSelector } from "../../store/hooks";
import { formatNumberCompactWithThreshold } from "../../shared/humanize/format-number";

interface Props extends React.HTMLProps<HTMLSpanElement> {
  value: number;
  threshold?: number;
  fractionDigits?: number;
}

const CompactNumber: React.FC<Props> = ({
  value,
  threshold,
  fractionDigits,
  ...restProps
}) => {
  const locale = useAppSelector((state) => state.locale.current);

  const formattedValue = React.useMemo(() => {
    return formatNumberCompactWithThreshold(value, threshold, fractionDigits, locale);
  }, [value, threshold, fractionDigits, locale]);

  return <span {...restProps}>{formattedValue}</span>;
};

export default CompactNumber;
