import React from 'react'
import styles from './category.module.scss'

export default function Category({ children }: { children: React.ReactNode }) {
  return <span className={styles.category}>{children}</span>
}
