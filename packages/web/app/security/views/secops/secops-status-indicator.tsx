import React from 'react'
import styles from './secops.module.scss'

export interface SecOpsStatusIndicatorProps {
  children: React.ReactNode
}

export default function SecOpsStatusIndicator({ children }: SecOpsStatusIndicatorProps) {
  return (
    <div className={styles.secOpsStatusIndicatorContainer}>
      <div className={styles.secOpsStatusIndicator} />
      {children}
    </div>
  )
}
