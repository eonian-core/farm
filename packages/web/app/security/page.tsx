"use client";

import { MDXProvider } from "@mdx-js/react";
import type { MDXComponents } from "mdx/types";
import dynamic from "next/dynamic";
import styles from "./page.module.scss";
import heading from "../components/heading/heading";
import {InternalLink} from "../components/links/links";

const components: MDXComponents = {
  h1: heading.H1,
  h2: heading.H2,
  h3: heading.H3,
  h4: heading.H4,
  Column: dynamic(import('./columns/columns')),
  ImageCard: dynamic(import('../components/image-card/image-card')),
  Card: dynamic(import('../components/card/card')),
  Target: dynamic(import("../components/image-card/image-card").then(({Target}) => Target)),
  InternalLink: dynamic(import('../components/links/links').then(({ InternalLink }) => InternalLink)),
  Approach: dynamic(import('./views/approach/approach')),
  SecOps: dynamic(import('./views/secops/secops')),
  SecOpsDescription: dynamic(import('./views/secops/secops-description')),
  SecOpsCards: dynamic(import('./views/secops/secops-cards')),
  SecOpsStatusIndicator: dynamic(import('./views/secops/secops-status-indicator')),
  SecOpsCodeReview: dynamic(import('./views/secops/secops-code-review')),
  SecOpsRiskThreatModel: dynamic(import('./views/secops/secops-risk-threat-model')),
  blockquote: dynamic(import('./views/secops/secops-indicator-label')) as any,
  strong: dynamic(import('./views/secops/secops-indicator-label-green')) as any,
  DeepSecurity: dynamic(import('./views/deepsecurity/deepsecurity')),
  DeepSecurityDescription: dynamic(import('./views/deepsecurity/deepsecurity-description')),
}


export default function Home() {
  const Content = dynamic(import(`./content/en.mdx`));

  return (
    <main className={styles.main}>
      <div className={styles.content}>
        <MDXProvider components={components}>
          <Content />
        </MDXProvider>
      </div>
    </main>
  );
}