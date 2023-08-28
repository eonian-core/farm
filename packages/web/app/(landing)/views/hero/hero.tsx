import React from 'react'
import { Inter } from 'next/font/google'
import clsx from 'clsx'
import Container from '../../../components/contrainer/container'
import IconScroll from '../../../components/icons/icon-scroll'
import styles from './hero.module.scss'

const inter = Inter({
  subsets: ['latin', 'cyrillic'],
  display: 'block', // force to show font anyway
})

export interface HeroProps {
  children: React.ReactNode
  description: React.ReactNode
}

export default function Hero({ children }: HeroProps) {
  return (
    <Container>
      <div className={clsx(styles.hero, inter.className)}>
        {children}

        <IconScroll className={styles.scrollIcon} />
      </div>
    </Container>
  )
}
