'use client'

import { MDXProvider } from '@mdx-js/react'
import type { MDXComponents } from 'mdx/types'
import heading from '../components/heading/heading'
import styles from './page.module.scss'
import Column from './columns/columns'
import Contacts from './contacts/contacts'
import Content from './content/en.mdx'

const components: MDXComponents = {
  h1: heading.H1,
  h2: heading.H2,
  Column,
  Contacts,
}

export default function Home() {
  return (
    <main className={styles.main}>
      <div className={styles.content}>
        <MDXProvider components={components}>
          <Content />
        </MDXProvider>
      </div>
    </main>
  )
}
