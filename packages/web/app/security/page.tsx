'use client'

import { MDXProvider } from '@mdx-js/react'
import type { MDXComponents } from 'mdx/types'
import heading from '../components/heading/heading'
import { InternalLink } from '../components/links/links'
import ImageCard, { Target } from '../components/image-card/image-card'
import Card from '../components/card/card'
import styles from './page.module.scss'
import Column from './columns/columns'
import Approach from './views/approach/approach'
import SecOps from './views/secops/secops'
import SecOpsDescription from './views/secops/secops-description'
import SecOpsCards from './views/secops/secops-cards'
import SecOpsStatusIndicator from './views/secops/secops-status-indicator'
import SecOpsCodeReview from './views/secops/secops-code-review'
import SecOpsRiskThreatModel from './views/secops/secops-risk-threat-model'
import blockquote from './views/secops/secops-indicator-label'
import strong from './views/secops/secops-indicator-label-green'
import DeepSecurity from './views/deepsecurity/deepsecurity'
import DeepSecurityDescription from './views/deepsecurity/deepsecurity-description'
import Content from './content/en.mdx'

const components: MDXComponents = {
  h1: heading.H1,
  h2: heading.H2,
  h3: heading.H3,
  h4: heading.H4,
  Column,
  ImageCard,
  Card,
  Target,
  InternalLink,
  Approach,
  SecOps,
  SecOpsDescription,
  SecOpsCards,
  SecOpsStatusIndicator,
  SecOpsCodeReview,
  SecOpsRiskThreatModel,
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  blockquote: blockquote as any,
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  strong: strong as any,
  DeepSecurity,
  DeepSecurityDescription,
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
