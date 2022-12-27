import React from 'react'
import styles from './container.module.scss'

// props for Container component
export interface ContainerProps {
    children: React.ReactNode
    frame?: boolean
}

export default function Container({children, frame}: ContainerProps) {
    return (
        <section className={`${styles.container} ${frame ? styles.frame : ''}`}>
            {children}
        </section>
    )
}