import styles from "./page.module.css";
import Hero from "./views/hero/hero";
import Footer from "./views/footer/footer";

export default function Home() {
  return (
    <main className={styles.main}>
      <Hero />

      <Footer />
    </main>
  );
}
