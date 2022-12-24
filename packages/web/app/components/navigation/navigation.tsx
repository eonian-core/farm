import { Roboto } from "@next/font/google";
import styles from "./navigation.module.scss";
import Link from "next/link";
import EonianLogo from "../logo/logo";

const roboto = Roboto({ subsets: ["latin"], weight: ["500"] });

export default function Navigation() {
  return (
    <nav className={styles.navigation}>
      <ul className={styles.content}>
        <li className={styles.logo}>
          <Link href="/" className="flex flex-row items-center">
            <div className="mr-3 flex-shrink-0">
              <EonianLogo height={30} width={70} />
            </div>
            <span className={roboto.className}>Eonian</span>
          </Link>
        </li>
      </ul>
    </nav>
  );
}
