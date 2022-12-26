import styles from "./navigation.module.scss";
import LogoWithText from "../logo/logo-with-text";

export default function Navigation() {
  return (
    <nav className={styles.navigation}>
      <ul className={styles.content}>
        <li className={styles.logo}>
          <LogoWithText />
        </li>
      </ul>
    </nav>
  );
}
