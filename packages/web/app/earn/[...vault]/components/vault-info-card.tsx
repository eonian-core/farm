'use client'

import { Card } from '@nextui-org/react'
import React from 'react'

import clsx from 'clsx'
import type { Vault } from '../../../api'

import CompactNumber from '../../../components/compact-number/compact-number'
import IconBoxArrow from '../../../components/icons/icon-box-arrow'

import { calculateVaultAPY } from '../../../shared/projections/calculate-apy'
import { FormAction } from '../../../store/slices/vaultActionSlice'
import styles from './vault-info-card.module.scss'

interface Props {
  value: bigint
  currentDeposit: bigint
  vault: Vault
  formAction: FormAction
  className?: string
}

export const VaultInfoCard: React.FC<Props> = ({ value, currentDeposit, vault, formAction, className }) => {
  const { symbol: assetSymbol } = vault.asset

  const threshold = React.useMemo(() => BigInt(1e6) * 10n ** BigInt(vault.asset.decimals), [vault.asset.decimals])

  const [apyPercents, apy, apyD] = React.useMemo(() => {
    const bps = 1e6
    const apy = calculateVaultAPY(vault)
    return [apy, BigInt(Number.parseInt(String(apy * bps))), BigInt(bps * 100)]
  }, [vault])

  const total = React.useMemo(() => {
    switch (formAction) {
      case FormAction.DEPOSIT:
        return currentDeposit + value
      case FormAction.WITHDRAW:
        return currentDeposit < value ? 0n : currentDeposit - value
    }
  }, [currentDeposit, value, formAction])

  const currentYearlyReward = React.useMemo(() => (currentDeposit * apy) / apyD, [currentDeposit, apy, apyD])

  const yearlyReward = React.useMemo(() => (total * apy) / apyD, [total, apy, apyD])

  const depositInAYear = React.useMemo(() => total + yearlyReward, [total, yearlyReward])

  const profitChange = React.useMemo(() => yearlyReward - currentYearlyReward, [yearlyReward, currentYearlyReward])

  return (
    <Card.Body className={className}>
      <header className={styles.apyInfo}>
        With the current <b>{apyPercents.toFixed(2)}% APY</b>, projected
      </header>
      <Card variant="bordered" className={styles.info}>
        <Card.Body>
          <ul>
            <li>
              <h5>Yearly reward</h5>
              <InfoNumber value={yearlyReward} />
            </li>
            <li>
              <h5>Deposit in a year</h5>
              <InfoNumber value={depositInAYear} />
            </li>
          </ul>
        </Card.Body>
      </Card>
    </Card.Body>
  )

  function InfoNumber(props: { value: bigint }) {
    return (
      <div className={styles.infoNumberWrapper}>
        <CompactNumber
          value={props.value}
          decimals={vault.asset.decimals}
          threshold={threshold}
          fractionDigits={2}
          className={styles.infoNumber}
          tooltipContent={value => `${value} ${assetSymbol}`}
        >
          <span className={styles.asset}>{assetSymbol}</span>
          <ProfitChangeIndicator profitChange={profitChange} />
        </CompactNumber>
      </div>
    )
  }
}

function ProfitChangeIndicator({ profitChange }: { profitChange: bigint }) {
  const direction = React.useMemo(() => (profitChange > 0 ? 'top' : 'bottom'), [profitChange])

  if (!profitChange) {
    return null
  }

  const className = clsx({
    [styles.positiveChange]: profitChange > 0n,
    [styles.negativeChange]: profitChange < 0n,
  })

  return (
    <span className={className}>
      <IconBoxArrow direction={direction} />
    </span>
  )
}
