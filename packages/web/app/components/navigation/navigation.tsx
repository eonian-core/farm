'use client'

import { useCallback, useEffect, useState } from 'react'
import LogoWithText from '../logo/logo-with-text'
import ConnectWallet from '../wallet/connect-wallet'
import type { ResourceItem } from '../../features'
import { showEarn } from '../../features'
import styles from './navigation.module.scss'
import { MenuItem } from './menu-item'
import Menu from './menu'
import { links, mobileLinks } from './links'

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const toggleMenu = useCallback(() => setIsOpen(!isOpen), [isOpen])
  const closeMenu = useCallback(() => setIsOpen(false), [])

  useEffect(() => {
    window.document.body.classList.toggle(styles.fixedBody, isOpen)
  }, [isOpen])

  return (
    <nav className={styles.navigation} id="navigation">
      <div className={styles.content}>
        <div className={styles.logo}>
          <LogoWithText />
        </div>

        <ul className={styles.topBarList}>
          <MenuItemList links={links} onClick={closeMenu} />
        </ul>

        <div className={styles.right}>
          {showEarn && <ConnectWallet />}
          <Menu isOpen={isOpen} toggleMenu={toggleMenu}>
            <MenuItemList links={mobileLinks} onClick={closeMenu} />
          </Menu>
        </div>
      </div>
    </nav>
  )
}

export interface MenuItemListProps {
  links: Array<ResourceItem>
  onClick: () => void
}

export function MenuItemList({ links, onClick }: MenuItemListProps) {
  return <>
    {links.map(({ href, label }) => (
      <MenuItem key={href} href={href} onClick={onClick}>
        {label}
      </MenuItem>
    ))}
  </>
}
