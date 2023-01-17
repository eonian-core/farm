"use client";

import styles from "./page.module.scss";
import { MDXComponents } from "mdx/types";
import heading from "../components/heading/heading";
import dynamic from "next/dynamic";
import { MDXProvider } from "@mdx-js/react";
import React from "react";

const components: MDXComponents = {
  h1: heading.H1,
  Collapse: dynamic(import("../components/collapse/collapse")),
  h3: dynamic(import("../components/collapse/collapse-header")),
  CollapseContent: dynamic(import("../components/collapse/collapse-content")),
  InternalLink: dynamic(import("../components/links/links").then(({ InternalLink }) => InternalLink)),
};

export default function FAQ() {
  const Content = dynamic(import(`./content/en.mdx`));

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
  );
}
