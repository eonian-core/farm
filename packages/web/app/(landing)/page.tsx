'use client'

import { MDXProvider } from '@mdx-js/react'
import type { MDXComponents } from 'mdx/types'
import dynamic from 'next/dynamic'
import styles from './page.module.css'
import Card from '../components/card/card'
import Hero from './views/hero/hero'
import heading from '../components/heading/heading'

const components: MDXComponents = {
  h2: heading.H2,
  Hero,
  Problem: dynamic(import('./views/problem/problem')),
  Category: dynamic(import('../components/category/category')),
  Solution: dynamic(import('./views/solution/solution')),
  Card: dynamic(import('../components/card/card')),
}


export default function Home() {
  const Content = dynamic(import(`./content/en.mdx`))

  return (
    <main className={styles.main}>
      
      <MDXProvider components={components}>
        <Content />
      </MDXProvider>

    </main>
  )
}
