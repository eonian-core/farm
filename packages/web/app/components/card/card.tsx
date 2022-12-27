import React from 'react'

import styles from './card.module.scss'

// Card props
interface CardProps {
  href: string
  children: React.ReactNode
}

export default function Card({href, children}: CardProps) {
  return (
    <a
      href={href}
      className={styles.card}
      target="_blank"
      rel="noopener noreferrer"
    >
      {children}
    </a>
  )
}