import React from 'react'

import styles from './card.module.scss'

/** Props for Card component */
export interface CardProps {
  /** Link to external page */
  href: string
  /** 
   * Children of card 
   * expect one h3 header and one p element
   * */
  children: React.ReactNode
}

/** Card component which primarly wraps block with header and text as card  */
export const Card = ({href, children}: CardProps) => (<a
    href={href}
    className={styles.card}
    target="_blank"
    rel="noopener noreferrer"
  >
    {children}
  </a>
)

export default Card