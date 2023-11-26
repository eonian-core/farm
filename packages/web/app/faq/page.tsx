'use client'

import type { MDXComponents } from 'mdx/types'
import { MDXProvider } from '@mdx-js/react'
import React from 'react'
import heading from '../components/heading/heading'
import { InternalLink } from '../components/links/links'
import Collapse from '../components/collapse/collapse'
import Content from './content/en.mdx'
import styles from './page.module.scss'

const components: MDXComponents = {
  h1: heading.H1,
  Collapse,
  InternalLink,
}

export default function FAQ() {
  return (
    <main className={styles.main}>
      <MDXProvider components={components}>
        <section className={styles.container}>
          <div className={styles.faqContent}>
            <Content />
          </div>
        </section>
      </MDXProvider>
    </main>
  )
}
