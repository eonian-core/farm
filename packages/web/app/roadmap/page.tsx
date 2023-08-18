"use client";

import { MDXProvider } from "@mdx-js/react";
import type { MDXComponents } from "mdx/types";
import styles from "./page.module.scss";
import heading from "../components/heading/heading";
import Content from "./content/en.mdx";
import Roadmap from "./views/roadmap/roadmap";
import RoadmapCheckpoint from "./views/roadmap/roadmap-checkpoint";
import RoadmapContainer from "./views/roadmap/roadmap-container";
import RoadmapDate from "./views/roadmap/roadmap-date";

const components: MDXComponents = {
  h1: heading.H1,
  h2: heading.H2,
  Roadmap,
  RoadmapCheckpoint,
  RoadmapContainer,
  RoadmapDate,
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
