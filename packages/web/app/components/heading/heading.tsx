import React from 'react'
import styles from './heading.module.scss'

export const H2 = ({ children }: { children?: React.ReactNode }) => (
    <h2 className={styles.header2}>{children}</h2>
)

const heading = {
    H2
}

export default heading