import React from 'react'
import { H3Context } from '../heading/heading'
import IconExternal from '../icons/icon-external'

import styles from './card.module.scss'

/** Props for Card component */
export interface CardProps {
  /** Link to external page */
  href: string
  /** 
   * Children of card 
   * expect one h3 header and one p element and Target component
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
    <H3Context.Provider value={{ isExternalLink: false }}>
      {children}
    </H3Context.Provider>
  </a>
)

export default Card

export interface TargetProps {
  children: React.ReactNode
}


/** Used to highlight to user where or for what purpose he can use page, to which Card component leads to */
export const Target = ({children}: TargetProps) => (
  <span className={styles.target}>{children} <IconExternal size={12} className="ml-1 inline" /></span>
)