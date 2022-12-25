import Image from 'next/image'
import { Inter, Roboto } from '@next/font/google'
import styles from './page.module.scss'
import Head from '../head'
import Collapse from '../components/collapse/collapse'

const roboto = Roboto({ subsets: ['latin'], weight: ['400', '700', '900'] })
const inter = Inter({ subsets: ['latin'] })

export default function FAQ() {
  return (
    <main className={styles.main}>
      <Head />
      <h2 className={roboto.className}>FAQ</h2>
      <p className={inter.className}>Answers on common questions about project, DeFi and crypto</p>
      <Collapse
        index={0}
        label="What is Eonian Profit?"
        description="Eonian Profit is yield aggregator, which main purpose to allow provide liqudity for a rewards in tokens of liqudity. It generate rewards through depositing liqudity to most profitable protocol on blockchain." />
      <Collapse
        index={1}
        label="What is protocol?"
        description="What is protocol content" />
      <Collapse
        index={2}
        label="What is DEX?"
        description="What is DEX content explanation?" />
      <Collapse
        index={3}
        label="What is Lending?"
        description="What is Lending content" />
      <Collapse
        index={4}
        label="What is Liqudity?"
        description="What is Liqudity content" />
      <Collapse
        index={5}
        label="What is Yield Aggregator?"
        description="What is Yield Aggregator content" />
      <Collapse
        index={6}
        label="What is Liqudty Mining?"
        description="What is Liqudty Mining content" />
      <Collapse
        index={7}
        label="What is APY?"
        description="What is APY content" />
      <Collapse
        index={8}
        label="I have another question"
        description="I have another question content" />
    </main>
  )
}
