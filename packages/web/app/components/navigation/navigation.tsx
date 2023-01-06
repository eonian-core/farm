import { motion } from "framer-motion";
import { Inter } from "@next/font/google";
import styles from "./navigation.module.scss";
import LogoWithText from "../logo/logo-with-text";
import { InternalLink } from "../links/links";
import { Menu } from "./menu";
import clsx from "clsx";
import { MenuItem } from "./menu-item";
import { useState, useEffect, useCallback } from "react";

export interface NavigationProps {
  onStateChange?: (isOpen: boolean) => void;
}


const inter = Inter({
  subsets: ["latin", "cyrillic"],
  display: 'block' // force to show font anyway
});

const showCommunity = process.env.NEXT_PUBLIC_FEATURE_COMMUNITY_PAGE === 'true';
const showFooter = process.env.NEXT_PUBLIC_FEATURE_FAQ_PAGE === 'true';

const links = [
  showCommunity && { href: '/community', label: 'Community' },
  showFooter && { href: '/faq', label: 'FAQ' }
].filter(Boolean) as Array<{ href: string, label: string }>;

const menuVariants = {
  open: {
    transition: { staggerChildren: 0.07, delayChildren: 0.2 }
  },
  closed: {
    transition: { staggerChildren: 0.05, staggerDirection: -1 }
  }
};

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
    <nav className={styles.navigation}>
      <div className={styles.content}>
        <div className={styles.logo}>
          <LogoWithText />
        </div>

        <ul className={styles.topBarList}>
          {items}
        </ul>

        <Menu isOpen={isOpen} toggleMenu={toggleMenu}>
          <motion.ul variants={menuVariants} className={clsx(inter.className, styles.menuList)}>
            {items}
          </motion.ul>
        </Menu>

      </div>
    </nav>
  );
}

