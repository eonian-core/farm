import clsx from 'clsx'
import React from 'react'
import styles from './hamburger-menu.module.scss'

export interface HamburgerMenuProps {
  active?: boolean
  onClick?: () => void
}

export const HamburgerMenu = React.forwardRef(
  ({ active, onClick }: HamburgerMenuProps, ref: React.LegacyRef<HTMLDivElement>) => (
    <div className={styles.box} onClick={onClick} ref={ref}>
      <div
        className={clsx(styles.btn, {
          [styles.active]: active,
          [styles.inactive]: !active,
        })}
      >
        <span></span>
        <span></span>
        <span></span>
      </div>
    </div>
  ),
)

HamburgerMenu.displayName = 'HamburgerMenu'
