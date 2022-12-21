import Image from 'next/image'
import { Inter } from '@next/font/google'
import styles from './page.module.css'
import Card from '../components/card/card'
import Hero from './views/hero/hero'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  return (
    <main className={styles.main}>
      <Hero />

      <div className={styles.grid}>
        <Card href="https://nextjs.org/docs" />

        <Card href="https://nextjs.org/docs" />

        <Card href="https://nextjs.org/docs" />
      </div>
    </main>
  )
}
