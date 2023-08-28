import React from 'react'

import styles from './vault-index-cell.module.scss'

interface Props {
  index: number
}

export const VaultIndexCell: React.FC<Props> = ({ index }) => <div className={styles.index}>{index + 1}</div>
