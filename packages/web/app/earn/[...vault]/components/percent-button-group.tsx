'use client'

import type { ButtonProps } from '@nextui-org/react'
import { Button } from '@nextui-org/react'
import React from 'react'

import styles from './percent-button-group.module.scss'

interface Props extends ButtonProps {
  inputValue: bigint
  maxValue: bigint
  onValueChange: (value: bigint) => void
}

const COUNT = 4

export const PercentButtonGroup: React.FC<Props> = ({ inputValue, maxValue, onValueChange, ...restProps }) => {
  const precise = 100
  return (
    <div className={styles.container}>
      {Array.from({ length: COUNT }).fill(0).map((_, index) => {
        const percents = (precise / COUNT) * (index + 1)
        const factor = BigInt(percents)
        const maxFactor = BigInt(precise)

        const resultValue = (maxValue * factor) / maxFactor
        const isActive = inputValue > 0n && resultValue === inputValue

        const onPress = () => {
          onValueChange(resultValue)
        }

        return (
          <Button
            key={index}
            className={styles.button}
            color="primary"
            auto
            bordered={!isActive}
            onPress={onPress}
            {...restProps}
          >
            {percents}%
          </Button>
        )
      })}
    </div>
  )
}
