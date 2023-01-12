"use client";

import { MDXProvider } from "@mdx-js/react";
import type { MDXComponents } from "mdx/types";
import dynamic from "next/dynamic";
import styles from "./page.module.css";
import Hero from "./views/hero/hero";
import heading from "../components/heading/heading";
import Solution, { Block, BigNumber } from "./views/solution/solution";
import PageLoader from "../components/page-loader/page-loader";

const components: MDXComponents = {
  h2: heading.H2,
  h3: heading.H3,
  Hero,
  Problem: dynamic(import("./views/problem/problem")),
  Category: dynamic(import("../components/category/category")),
  Solution,
  Block,
  BigNumber,
  Roadmap: dynamic(import("./views/roadmap/roadmap"), {
    ssr: false, // Disable prerender for Roadmap, it's useless and breaks the layout
    loading: () => <PageLoader />,
  }),
  RoadmapCheckpoint: dynamic(import("./views/roadmap/roadmap-checkpoint"), {ssr: false}),
  RoadmapContainer: dynamic(import("./views/roadmap/roadmap-container"), {ssr: false}),
  RoadmapDate: dynamic(import("./views/roadmap/roadmap-date"), {ssr: false}),
  Card: dynamic(import("../components/card/card")),
  Mbr: dynamic(import("../components/mobile-break/mobile-break")),
};

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
