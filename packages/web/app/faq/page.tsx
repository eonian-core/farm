"use client";

import styles from "./page.module.css";
import Container from "./container/container";
import {MDXComponents} from "mdx/types";
import heading from "../components/heading/heading";
import dynamic from "next/dynamic";
import {MDXProvider} from "@mdx-js/react";

const components: MDXComponents = {
    h1: heading.H1SubPage,
    Collapse: dynamic(import('../components/collapse/collapse')),
}

export default function FAQ() {
  const Content = dynamic(import(`./content/en.mdx`));

  return (
    <main className={styles.main}>
      <MDXProvider components={components}>
        <Container>
          <Content />
        </Container>
      </MDXProvider>
    </main>
  );
}
