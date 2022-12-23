import { Roboto } from "@next/font/google";
import Container from "../contrainer/container";
import styles from "./hero.module.scss";

const roboto = Roboto({ subsets: ['latin'], weight: ['400', '700', '900'] })

export default function Hero() {
  return (
    <Container>
      <div className={styles.hero}>
        <h1 className={roboto.className}>
          <span>Make</span> Crypto <br /> Work <span>for You.</span>
        </h1>
        <p className={roboto.className}>
          We build passive investment strategies <span>that cares about your money.</span>
        </p>
      </div>
    </Container>
  );
}
