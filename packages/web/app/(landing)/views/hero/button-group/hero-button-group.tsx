import React from 'react'

import styles from './hero-button-group.module.scss'

interface Props {
  children: React.ReactNode
}

const HeroButtonGroup: React.FC<Props> = ({ children }) => <div className={styles.container}>{children}</div>

export default HeroButtonGroup
