import React from 'react'
import styles from './secops.module.scss'

export interface SecOpsCardsProps {
  children: React.ReactNode
}

export default function SecOpsCards({ children }: SecOpsCardsProps) {
  return <div className={styles.secOpsCards}>{children}</div>
}
