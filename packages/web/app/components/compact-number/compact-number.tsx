import React from 'react'
import { Tooltip } from '@nextui-org/react'
import { useAppSelector } from '../../store/hooks'
import type { FractionPartView } from '../../shared/humanize'
import { formatNumberCompactWithThreshold } from '../../shared/humanize'
import { toStringNumberFromDecimals } from '../../shared'

interface Props {
  value: bigint
  decimals: number
  threshold?: bigint
  fractionDigits?: number
  fractionPartView?: FractionPartView
  className?: string
  children?: React.ReactNode
  childrenAtStart?: boolean
  hideTooltip?: boolean
  tooltipContent?: (value: string) => React.ReactNode
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
  hideTooltip,
  tooltipContent = value => value,
}) => {
  const locale = useAppSelector(state => state.locale.current)

  const formattedValue = formatNumberCompactWithThreshold(value, decimals, {
    threshold,
    fractionDigits,
    fractionPartView,
    locale,
  })

  const accurateValue = toStringNumberFromDecimals(value, decimals)
  const content = (
    <>
      {childrenAtStart && children}
      <span>{formattedValue}</span>
      {!childrenAtStart && children}
    </>
  )

  return hideTooltip
    ? (
        content
      )
    : (
    <Tooltip className={className} content={tooltipContent(accurateValue)}>
      {content}
    </Tooltip>
      )
}

export default React.memo(CompactNumber)
