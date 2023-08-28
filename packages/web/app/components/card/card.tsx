import React from 'react'
import clsx from 'clsx'
import { H3Context } from '../heading/heading'
import IconExternal from '../icons/icon-external'

import styles from './card.module.scss'

/** Props for Card component */
export interface CardProps {
  /** Link to external page */
  href: string
  /** Inactive behavior */
  disabled?: boolean
  /**
   * Children of card
   * expect one h3 header and one p element and Target component
   * */
  children: React.ReactNode
}

/** Card component which primarly wraps block with header and text as card  */
export function Card({ href, children, disabled = false }: CardProps) {
  return <a
    href={href}
    className={clsx(styles.card, { [styles.disabled]: disabled })}
    target="_blank"
    rel="noopener noreferrer"
  >
    <H3Context.Provider value={{ isExternalLink: false }}>{children}</H3Context.Provider>
  </a>
}

export default Card

export interface TargetProps {
  children: React.ReactNode
}

/** Used to highlight to user where or for what purpose he can use page, to which Card component leads to */
export function Target({ children }: TargetProps) {
  return <span className={styles.target}>
    {children} <IconExternal size={12} className="ml-1 inline" />
  </span>
}
