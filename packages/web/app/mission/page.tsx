"use client";

import { MDXProvider } from "@mdx-js/react";
import type { MDXComponents } from "mdx/types";
import dynamic from "next/dynamic";
import styles from "./page.module.scss";
import heading from "../components/heading/heading";
import { LinkInText } from "../components/links/link-in-text";

const components: MDXComponents = {
  h1: heading.H1,
  h2: heading.H2,
  a: LinkInText as any, // no lazy loading for links, prevent flash of content
  WhoWeAre: dynamic(import("./views/who-are-we/who-are-we")),
  Description: dynamic(import("./views/who-are-we/description")),
  Name: dynamic(import("./views/who-are-we/name")),
  Problem: dynamic(import("./views/problem/problem")),
  blockquote: dynamic(import("../components/category/category")) as any,
  Solution: dynamic(import("./views/solution/solution")),
  Revolution: dynamic(import("./views/revolution/revolution")),
  Card: dynamic(import("../components/card/card")),
  Target: dynamic(
    import("../components/card/card").then(({ Target }) => Target)
  ),
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
