import React from 'react'
import styles from './secops.module.scss'

export default function IndicatorLabelGreen({ children }: { children: React.ReactNode }) {
  return <span className={styles.indicatorLabelGreen}>{children}</span>
}
