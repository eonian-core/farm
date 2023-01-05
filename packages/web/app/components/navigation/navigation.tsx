import styles from "./navigation.module.scss";
import LogoWithText from "../logo/logo-with-text";
import { InternalLink } from "../links/links";

export default function Navigation() {
  const showCommunity = process.env.NEXT_PUBLIC_FEATURE_COMMUNITY_PAGE === 'true';
  const showFooter = process.env.NEXT_PUBLIC_FEATURE_FAQ_PAGE === 'true';
  

  return (
    <nav className={styles.navigation}>
      <div className={styles.content}>
        <div className={styles.logo}><LogoWithText /></div>
        <ul className={styles.list}>
          <li>
            {showCommunity && <InternalLink href="/community">Community</InternalLink>}
          </li>

          <li>
            {showFooter && <InternalLink href="/faq">FAQ</InternalLink>}
          </li>
        </ul>

      </div>
    </nav>
  );
}
