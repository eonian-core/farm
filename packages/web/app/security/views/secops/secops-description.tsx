import React from 'react'
import styles from './secops.module.scss'

export interface SecOpsDescriptionProps {
  children: React.ReactNode
}

export default function SecOpsDescription({ children }: SecOpsDescriptionProps) {
  return <div className={styles.secOpsDescription}>{children}</div>
}
