'use client';

import { MDXProvider } from '@mdx-js/react';
import type { MDXComponents } from 'mdx/types';
import styles from './page.module.scss';
import heading from '../components/heading/heading';
import { LinkInText } from '../components/links/link-in-text';
import Card, { Target } from '../components/card/card';
import Revolution from './views/revolution/revolution';
import Solution from './views/solution/solution';
import blockquote from '../components/category/category';
import Problem from './views/problem/problem';
import Name from './views/who-are-we/name';
import Description from './views/who-are-we/description';
import WhoWeAre from './views/who-are-we/who-are-we';
import Content from './content/en.mdx';

const components: MDXComponents = {
  h1: heading.H1,
  h2: heading.H2,
  a: LinkInText as any,
  WhoWeAre,
  Description,
  Name,
  Problem,
  blockquote: blockquote as any,
  Solution,
  Revolution,
  Card,
  Target,
};

export default function Home() {
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
