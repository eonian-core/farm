import React, { useContext } from 'react'
import { Inter } from 'next/font/google'

import clsx from 'clsx'
import IconExternal from '../icons/icon-external'
import styles from './heading.module.scss'
import { useContentToId } from './to-id'

const inter = Inter({
  subsets: ['latin', 'cyrillic'],
  display: 'block', // force to show font anyway
})

export interface HeaderProps {
  children?: React.ReactNode
  id?: string
}

export function H1({ children, id }: HeaderProps) {
  const contentId = useContentToId(children)
  return (
    <h1 id={id || contentId} className={clsx(styles.header1, inter.className)}>
      {children}
    </h1>
  )
}
export function H2({ children, id }: HeaderProps) {
  const contentId = useContentToId(children)
  return (
    <h2 id={id || contentId} className={clsx(styles.header2, inter.className)}>
      {children}
    </h2>
  )
}

export interface H3ContextState {
  isExternalLink: boolean
}

export const H3Context = React.createContext<H3ContextState>({ isExternalLink: false })

export function H3({ children, id }: HeaderProps) {
  const { isExternalLink } = useContext(H3Context)
  const contentId = useContentToId(children)

  return (
    <h3 id={id || contentId} className={`${styles.header3} ${inter.className}`}>
      {children}
      {isExternalLink && <IconExternal size={12} className={styles.iconExternal} />}
    </h3>
  )
}

export function H4({ children, id }: HeaderProps) {
  const contentId = useContentToId(children)
  return (
    <h4 id={id || contentId} className={clsx(styles.header4, inter.className)}>
      {children}
    </h4>
  )
}

const heading = {
  H1,
  H2,
  H3,
  H4,
}

export default heading
