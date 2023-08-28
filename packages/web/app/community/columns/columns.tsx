import React from 'react'
import styles from './columns.module.scss'

// Props for columns
export interface ColumnProps {
  children: React.ReactNode
}

// Two colunms layout
export const Column = ({ children }: ColumnProps) => <div className={styles.column}>{children}</div>

export default Column
