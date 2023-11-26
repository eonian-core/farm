import React, { useCallback } from 'react'
import clsx from 'clsx'
import { H3Context } from '../heading/heading'
import IconExternal from '../icons/icon-external'

import styles from './card.module.scss'

export interface CommonCardProps {
  /** Inactive behavior */
  disabled?: boolean
  /**
   * Children of card
   * expect one h3 header and one p element and Target component
   * */
  children: React.ReactNode
}

export type CardProps = LinkCardProps | ButtonCardProps

export const isLinkedCardProps = (props: CardProps): props is LinkCardProps => (props as LinkCardProps).href !== undefined

export function Card(props: CardProps) {
  if (isLinkedCardProps(props)) {
    return <LinkCard {...props} />
  }
  return <ButtonCard {...props} />
}

export default Card

/** Props for LinkCard component */
export interface LinkCardProps extends CommonCardProps {
  /** Link to external page */
  href: string
}

/** Card component which primarly wraps block with header and text as card  */
export function LinkCard({ href, children, disabled = false }: LinkCardProps) {
  return <a
  href={href}
  className={clsx(styles.card, { [styles.disabled]: disabled })}
  target="_blank"
  rel="noopener noreferrer"
>
  <H3Context.Provider value={{ isExternalLink: false }}>{children}</H3Context.Provider>
</a>
}

export interface ButtonCardProps extends CommonCardProps {
  /** Triggered when someone click on button */
  onClick: () => void
}

export function ButtonCard({ onClick, children, disabled = false }: ButtonCardProps) {
  const handleClick = useCallback((e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.preventDefault()

    if (!disabled) {
      onClick()
    }
  }, [disabled, onClick])

  return (
    <div
      className={clsx(styles.card, { [styles.disabled]: disabled })}
      onClick={handleClick}
    >
      <H3Context.Provider value={{ isExternalLink: false }}>
        {children}
      </H3Context.Provider>
    </div>
  )
}

export interface TargetProps {
  children: React.ReactNode
  isExternal?: boolean
}

/** Used to highlight to user where or for what purpose he can use page, to which Card component leads to */
export function Target({ children, isExternal = true }: TargetProps) {
  return <span className={styles.target}>{children} {isExternal && <IconExternal size={12} className="ml-1 inline" />}</span>
}
