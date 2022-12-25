'use client'

import { MDXProvider } from '@mdx-js/react'
import type { MDXComponents } from 'mdx/types'
import dynamic from 'next/dynamic'
import styles from './page.module.css'
import Card from '../components/card/card'
import Hero from './views/hero/hero'

const components: MDXComponents = {
  h1: ({children}) => {
    // if header contain <br /> children can be array of string and <br /> elements 
    const last = Array.isArray(children) ? children[children.length - 1] : children

    // extract last line of header as description block in hero
    const [header, description] = last.split('\n')
    
    return <Hero {...{description}} >
      {Array.isArray(children) ? children.slice(0, -1) : null}
      {header}
    </Hero>
  },
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
