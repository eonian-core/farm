import Image from 'next/image'
import { Inter } from '@next/font/google'
import styles from './page.module.css'
import ButtonBlock from '../components/card/card'
import Hero from './views/hero/hero'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  return (
    <main className={styles.main}>
      <Hero />

      <button className="btn">Hello daisyUI</button>

      <div className={styles.grid}>
        <ButtonBlock href="https://nextjs.org/docs" />

        <ButtonBlock href="https://nextjs.org/docs" />

        <ButtonBlock href="https://nextjs.org/docs" />
      </div>
    </main>
  )
}
