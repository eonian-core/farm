import React from 'react'
import styles from './secops.module.scss'

export default function IndicatorLabel({ children }: { children: React.ReactNode }) {
  return <span className={styles.indicatorLabel}>{children}</span>
}
