'use client'

import { MDXProvider } from '@mdx-js/react'
import type { MDXComponents } from 'mdx/types'
import heading from '../components/heading/heading'
import styles from './page.module.scss'
import Content from './content/en.mdx'
import Roadmap from './views/roadmap/roadmap'
import RoadmapCheckpoint from './views/roadmap/roadmap-checkpoint'
import RoadmapContainer from './views/roadmap/roadmap-container'
import RoadmapDate from './views/roadmap/roadmap-date'
import Overview from './views/overview/overview'

const components: MDXComponents = {
  h1: heading.H1,
  h2: heading.H2,
  Overview,
  Roadmap,
  RoadmapCheckpoint,
  RoadmapContainer,
  RoadmapDate,
}

export default function Home() {
  return (
    <main className={styles.main}>
      <MDXProvider components={components}>
        <Content />
      </MDXProvider>
    </main>
  )
}
