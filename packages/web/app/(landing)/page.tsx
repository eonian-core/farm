"use client";

import { MDXProvider } from "@mdx-js/react";
import type { MDXComponents } from "mdx/types";
import dynamic from "next/dynamic";
import styles from "./page.module.css";
import Hero from "./views/hero/hero";
import PageLoader from "../components/page-loader/page-loader";


const components: MDXComponents = {
  Hero, // no lazy loading for Hero, it's the first thing that's rendered
  h2: dynamic(import("../components/heading/heading").then(({H2}) => H2)),
  h3: dynamic(import("../components/heading/heading").then(({H3}) => H3)),
  Problem: dynamic(import("./views/problem/problem")),
  Category: dynamic(import("../components/category/category")),
  Solution: dynamic(import("./views/solution/solution")),
  Founders: dynamic(import("./views/founders/founders")),
  FoundersList: dynamic(import("./views/founders/founders-list")),
  Founder: dynamic(import("./views/founders/founder")),
  ExternalLink: dynamic(import("../components/links/external-link")),
  IconLinkedIn: dynamic(import("../components/icons/icon-linkedin")),
  IconTwitter: dynamic(import("../components/icons/icon-twitter")),
  Roadmap: dynamic(import("./views/roadmap/roadmap"), {
    ssr: false, // Disable prerender for Roadmap, it's useless and breaks the layout
    loading: () => <PageLoader />,
  }),
  RoadmapCheckpoint: dynamic(import("./views/roadmap/roadmap-checkpoint"), {
    ssr: false,
  }),
  RoadmapContainer: dynamic(import("./views/roadmap/roadmap-container"), {
    ssr: false,
  }),
  RoadmapDate: dynamic(import("./views/roadmap/roadmap-date"), { ssr: false }),
  InDevelopment: dynamic(import("./views/in-development/in-development")),
  Card: dynamic(import("../components/card/card")),
  Target: dynamic(import("../components/card/card").then(({Target}) => Target)),
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
