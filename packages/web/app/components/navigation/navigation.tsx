import styles from "./navigation.module.scss";
import LogoWithText from "../logo/logo-with-text";
import { InternalLink } from "../links/links";
import { MenuItem } from "./menu-item";
import { useState, useEffect, useCallback } from "react";
import { TOP_ELELEMENT_ID } from "../links/useScrollToTop";
import Menu from "./menu"; // TODO: use async import, when framer motion will support it

export interface NavigationProps {
  onStateChange?: (isOpen: boolean) => void;
}

const showCommunity = process.env.NEXT_PUBLIC_FEATURE_COMMUNITY_PAGE === 'true';
const showFooter = process.env.NEXT_PUBLIC_FEATURE_FAQ_PAGE === 'true';

const links = [
  showCommunity && { href: '/community', label: 'Community' },
  showFooter && { href: '/faq', label: 'FAQ' }
].filter(Boolean) as Array<{ href: string, label: string }>;



export default function Navigation({ onStateChange }: NavigationProps) {

  const [isOpen, setIsOpen] = useState(false);
  const toggleMenu = useCallback(() => setIsOpen(!isOpen), [isOpen]);
  const closeMenu = useCallback(() => setIsOpen(false), []);

  useEffect(() => {
    onStateChange && onStateChange(isOpen);
  }, [isOpen, onStateChange]);

  const items = links.map(({ href, label }) => (
    <MenuItem key={href}>
      <InternalLink href={href} onClick={closeMenu}>{label}</InternalLink>
    </MenuItem>
  ))

  return (
    <nav className={styles.navigation} id={TOP_ELELEMENT_ID}>
      <div className={styles.content}>
        <div className={styles.logo}>
          <LogoWithText />
        </div>

        <ul className={styles.topBarList}>
          {items}
        </ul>

        <Menu isOpen={isOpen} toggleMenu={toggleMenu}>
          {items}
        </Menu>

      </div>
    </nav>
  );
}

