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
  Column: dynamic(import('./columns/columns')),
  InternalLink: dynamic(import('../components/links/links').then(({ InternalLink }) => InternalLink)),
  Approach: dynamic(import('./views/approach/approach')),
  ApproachDescription: dynamic(import('./views/approach/approach-description')),
  SecOps: dynamic(import('./views/secops/secops')),
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
