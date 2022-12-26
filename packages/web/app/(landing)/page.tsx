'use client'

import { MDXProvider } from '@mdx-js/react'
import type { MDXComponents } from 'mdx/types'
import dynamic from 'next/dynamic'
import styles from './page.module.css'
import Card from '../components/card/card'
import Hero from './views/hero/hero'

const components: MDXComponents = {
  Hero,
  Problem: dynamic(import('./views/problem/problem')),
  Category: dynamic(import('../components/category/category')),
}


export default function Home() {
  const Content = dynamic(import(`./content/en.mdx`))

  return (
    <main className={styles.main}>
      

      <MDXProvider components={components}>
        <Content />
      </MDXProvider>

      <div className={styles.grid}>
        <Card href="https://nextjs.org/docs" />

        <Card href="https://nextjs.org/docs" />

        <Card href="https://nextjs.org/docs" />
      </div>
    </main>
  )
}
