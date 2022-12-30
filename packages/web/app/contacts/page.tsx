"use client";

import { MDXProvider } from "@mdx-js/react";
import type { MDXComponents } from "mdx/types";
import dynamic from "next/dynamic";
import styles from "./page.module.scss";
import heading from "../components/heading/heading";
import Container from "../components/contrainer/container";


const components: MDXComponents = {
  h1: heading.H1,
  h2: heading.H2,
}


export default function Home() {
  const Content = dynamic(import(`./content/en.mdx`));

  return (
    <main className={styles.main}>
        <MDXProvider components={components}>
          <Content />
        </MDXProvider>
    </main>
  );
}
