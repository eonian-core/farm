import React from 'react'
import styles from './mobile-break.module.scss'

/// Behaive like <br /> but only on mobile
export default function Mbr({ children }: { children: React.ReactNode }) {
  return <span className={styles.mobileBreak}>{children}</span>
}
