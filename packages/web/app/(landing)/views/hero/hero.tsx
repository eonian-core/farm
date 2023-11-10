import React from 'react'
import clsx from 'clsx'
import { Inter } from 'next/font/google'
import Container from '../../../components/contrainer/container'
import IconScroll from '../../../components/icons/icon-scroll'
import { useIsScrolled } from '../../../components/parallax/useIsScrolled'
import styles from './hero.module.scss'

const inter = Inter({
  subsets: ['latin', 'cyrillic'],
  display: 'block', // force to show font anyway
})

export interface HeroProps {
  children: React.ReactNode
}

export default function Hero({ children }: HeroProps) {
  const isScrolled = useIsScrolled()

  return (
    <Container>
      <div className={clsx(styles.hero, inter.className)}>
        {children}

        <IconScroll className={clsx(styles.scrollIcon, { [styles.hidden]: isScrolled })} />
      </div>
    </Container>
  )
}
