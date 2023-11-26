import { useRef } from 'react'
import { CSSTransition } from 'react-transition-group'

import { Inter } from 'next/font/google'
import clsx from 'clsx'
import { HamburgerMenu } from '../hamburger-menu/hamburger-menu'
import styles from './navigation.module.scss'
import { SocialMenuItem } from './menu-item'

export interface MenuProps {
  children: React.ReactNode
  isOpen?: boolean
  toggleMenu?: () => void
}

const inter = Inter({
  subsets: ['latin', 'cyrillic'],
  display: 'block', // force to show font anyway
})

export function Menu({ children, isOpen, toggleMenu }: MenuProps) {
  const nodeRef = useRef(null)

  return (
    <div className={clsx(styles.menuWrapper, { [styles.menuOpen]: isOpen })}>
      <CSSTransition
        nodeRef={nodeRef}
        in={isOpen}
        timeout={1000}
        classNames={{
          enter: styles.menuEnter,
          enterActive: styles.menuEnterActive,
          enterDone: styles.menuEnterDone,
          exit: styles.menuExit,
          exitActive: styles.menuExitActive,
          exitDone: styles.menuExitDone,
        }}
      >
        <div ref={nodeRef} className={styles.menuBackground}>
          <ul className={clsx(inter.className, styles.menuList)}>
            {children}
            <SocialMenuItem />
          </ul>
        </div>
      </CSSTransition>

      <div className={styles.hamburger}>
        <HamburgerMenu active={isOpen} onClick={toggleMenu} />
      </div>
    </div>
  )
}

export default Menu
