import styles from "./navigation.module.scss";
import LogoWithText from "../logo/logo-with-text";
import { InternalLink } from "../links/links";
import { MenuItem } from "./menu-item";
import { useState, useEffect, useCallback } from "react";
import { TOP_ELELEMENT_ID } from "../links/useScrollToTop";
import Menu from "./menu";


// TODO: highlight or cross out link for current page

export interface NavigationProps {
  onStateChange?: (isOpen: boolean) => void;
}

const showCommunity = process.env.NEXT_PUBLIC_FEATURE_COMMUNITY_PAGE === 'true';
const showFooter = process.env.NEXT_PUBLIC_FEATURE_FAQ_PAGE === 'true';

export interface NavigationItem {
  href: string,
  label: string
}

const links = [
  showCommunity && { href: '/community', label: 'Community' },
  showFooter && { href: '/faq', label: 'FAQ' }
].filter(Boolean) as Array<NavigationItem>;

const mobileLinks: Array<NavigationItem> = [
  { href: '/', label: 'Home' },
  ...links
]

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

      </div>
    </nav>
  );
}

export interface MenuItemListProps {
  links: Array<NavigationItem>
  onClick: () => void
}

export const MenuItemList = ({ links, onClick }: MenuItemListProps) => (
  <>
    {links.map(({ href, label }) => (
      <MenuItem key={href} href={href} onClick={onClick}>{label}</MenuItem>
    ))}
  </>
)