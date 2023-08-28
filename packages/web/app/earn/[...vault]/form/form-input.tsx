'use client'

import type { FormElement, InputProps } from '@nextui-org/react'
import { Input, Loading } from '@nextui-org/react'
import React from 'react'

import IconCoin from '../../../components/icons/icon-coin'
import CompactNumber from '../../../components/compact-number/compact-number'
import { FractionPartView } from '../../../shared'
import styles from './form-input.module.scss'

interface Props extends Partial<Omit<InputProps, 'value' | 'onChange'>> {
  value: string
  balance: bigint
  decimals: number
  assetSymbol: string
  onChange: (value: string) => void
  isLoading: boolean
}

const FormInput: React.FC<Props> = ({
  assetSymbol,
  balance,
  value,
  onChange,
  isLoading,
  disabled,
  decimals,
  ...restProps
}) => {
  const handleInputValueChange = React.useCallback(
    (event: React.ChangeEvent<FormElement>) => onChange(event.target.value),
    [onChange],
  )

  return (
    <Input
      className={styles.input}
      value={value}
      bordered
      color="primary"
      placeholder="0"
      size="xl"
      contentLeft={<IconCoin symbol={assetSymbol} width="1.5em" height="1.5em" />}
      contentRightStyling={false}
      contentRight={
        <InputRightContent balance={balance} isLoading={isLoading} decimals={decimals} assetSymbol={assetSymbol} />
      }
      onChange={handleInputValueChange}
      disabled={disabled || isLoading}
      {...restProps}
    />
  )
}

function InputRightContent({
  balance,
  isLoading,
  decimals,
  assetSymbol,
}: Pick<Props, 'balance' | 'isLoading' | 'decimals' | 'assetSymbol'>) {
  if (isLoading) {
    return <Loading className={styles.loading} size="sm" />
  }

  return (
    <span className={styles.balance}>
      <CompactNumber
        value={balance}
        decimals={decimals}
        fractionDigits={2}
        fractionPartView={FractionPartView.CUT}
        tooltipContent={value => `${value} ${assetSymbol}`}
        childrenAtStart
      >
        Balance:&nbsp;
      </CompactNumber>
    </span>
  )
}

export default FormInput
