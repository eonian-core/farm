import React from 'react'

import styles from './cell-with-description.module.scss'

interface Props {
  children: React.ReactNode
  description?: React.ReactNode
  icon?: React.ReactNode
}

export const CellWithDescription: React.FC<Props> = ({ icon, children, description }) => (
  <div className={styles.container}>
    {icon}
    <div className={styles.content}>
      <div>{children}</div>
      {description && <div className={styles.description}>{description}</div>}
    </div>
  </div>
)
