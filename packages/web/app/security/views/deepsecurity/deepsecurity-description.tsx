import React from 'react'
import styles from './deepsecurity.module.scss'

export interface DeepSecurityDescriptionProps {
  children: React.ReactNode
}

export default function DeepSecurityDescription({ children }: DeepSecurityDescriptionProps) {
  return <div className={styles.deepSecurityDescription}>{children}</div>
}
