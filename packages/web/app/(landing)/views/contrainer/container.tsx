import React from 'react'
import styles from './container.module.scss'

// props for Container component
export interface ContainerProps {
    children: React.ReactNode
    mobileFullWidth?: boolean
}

export default function Container({children, mobileFullWidth}: ContainerProps) {
    return (
        <section className={`${styles.container} ${mobileFullWidth ? styles.mobileFullWidth : ''}`}>
            {children}
        </section>
    )
}