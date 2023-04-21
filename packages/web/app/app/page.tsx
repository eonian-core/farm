"use client";

import { MDXProvider } from "@mdx-js/react";
import type { MDXComponents } from "mdx/types";
import styles from "./page.module.scss";
import heading from "../components/heading/heading";
import Content from "./content/en.mdx";

const components: MDXComponents = {
  h1: heading.H1,
  h2: heading.H2,
};

export default function App() {
  return (
    <main className={styles.main}>
      <MDXProvider components={components}>
        <Content />
      </MDXProvider>
    </main>
  );
}
