import { Row, Spacer, Tooltip } from '@nextui-org/react'
import React from 'react'
import CompactNumber from '../../../components/compact-number/compact-number'
import { toStringNumberFromDecimals } from '../../../shared'
import { CellWithDescription } from './cell-with-description'

interface Props {
  value: bigint
  decimals: number
  valueUSD: bigint
  decimalsUSD: number
  symbol: string
}

export const CellWithCurrency: React.FC<Props> = ({ value, decimals, symbol }) => {
  const valueUSD = value
  return (
    <Tooltip content={<TooltipContent />}>
      <CellWithDescription
        description={
          <ValueNumber value={valueUSD} decimals={decimals} currencyAtStart>
            $
          </ValueNumber>
        }
      >
        <ValueNumber value={value} decimals={decimals}>
          &nbsp;{symbol}
        </ValueNumber>
      </CellWithDescription>
    </Tooltip>
  )

  function TooltipContent() {
    const valueAccurate = toStringNumberFromDecimals(value, decimals)
    const valueUSDAccurate = toStringNumberFromDecimals(valueUSD, decimals)
    return (
      <>
        <Row justify="center">
          {valueAccurate}&nbsp;{symbol}
        </Row>
        <Spacer y={0.25} />
        <Row justify="center">${valueUSDAccurate}</Row>
      </>
    )
  }
}

interface ValueNumberProps extends React.PropsWithChildren {
  value: bigint
  decimals: number
  currencyAtStart?: boolean
}

function ValueNumber({ value, decimals, currencyAtStart, children }: ValueNumberProps) {
  const threshold = BigInt(1e6) * 10n ** BigInt(decimals)
  return (
    <CompactNumber
      value={value}
      decimals={decimals}
      threshold={threshold}
      fractionDigits={2}
      hideTooltip
      childrenAtStart={currencyAtStart}
    >
      {children}
    </CompactNumber>
  )
}
