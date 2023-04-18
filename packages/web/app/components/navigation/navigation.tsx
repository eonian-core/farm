import styles from "./navigation.module.scss";
import LogoWithText from "../logo/logo-with-text";
import { MenuItem } from "./menu-item";
import { useState, useEffect, useCallback } from "react";
import { TOP_ELELEMENT_ID } from "../links/useScrollToTop";
import Menu from "./menu";
import { links, mobileLinks, NavigationItem } from "./links";
import ConnectWallet from "../connect-wallet/ConnectWallet";

export interface NavigationProps {
  onStateChange?: (isOpen: boolean) => void;
}

export default function Navigation({ onStateChange }: NavigationProps) {
  const [isOpen, setIsOpen] = useState(false);
  const toggleMenu = useCallback(() => setIsOpen(!isOpen), [isOpen]);
  const closeMenu = useCallback(() => setIsOpen(false), []);

  useEffect(() => {
    onStateChange && onStateChange(isOpen);
  }, [isOpen, onStateChange]);

  return (
    <nav className={styles.navigation} id={TOP_ELELEMENT_ID}>
      <div className={styles.content}>
        <div className={styles.logo}>
          <LogoWithText />
        </div>

        <ul className={styles.topBarList}>
          <MenuItemList links={links} onClick={closeMenu} />
        </ul>

        <Menu isOpen={isOpen} toggleMenu={toggleMenu}>
          <MenuItemList links={mobileLinks} onClick={closeMenu} />
        </Menu>

        <div className={styles.connect}>
          <ConnectWallet />
        </div>
      </div>
    </nav>
  );
}

export interface MenuItemListProps {
  links: Array<NavigationItem>;
  onClick: () => void;
}

export const MenuItemList = ({ links, onClick }: MenuItemListProps) => (
  <>
    {links.map(({ href, label }) => (
      <MenuItem key={href} href={href} onClick={onClick}>
        {label}
      </MenuItem>
    ))}
  </>
);
