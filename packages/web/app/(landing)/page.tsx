"use client";

import { MDXProvider } from "@mdx-js/react";
import type { MDXComponents } from "mdx/types";
import dynamic from "next/dynamic";
import styles from "./page.module.css";
import Hero from "./views/hero/hero";
import PageLoader from "../components/page-loader/page-loader";
import FlowDiagramLoader from "./views/how-it-works/flow-diagram-loader";
import Mbr from "../components/mobile-break/mobile-break";

const components: MDXComponents = {
  Hero, // no lazy loading for Hero, it's the first thing that's rendered
  Mbr, // no lazy loading or it create a flash of content
  h2: dynamic(import("../components/heading/heading").then(({ H2 }) => H2)),
  h3: dynamic(import("../components/heading/heading").then(({ H3 }) => H3)),
  WhatIsEonian: dynamic(import("./views/what-is-eonian/what-is-eonian")),
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
  Target: dynamic(
    import("../components/card/card").then(({ Target }) => Target)
  ),
  HowItWorks: dynamic(import("./views/how-it-works/how-it-works")),
  FlowSlider: dynamic(import("./views/how-it-works/flow-slider")),
  FlowSliderItem: dynamic(import("./views/how-it-works/flow-slider-item")),
  FlowDiagramContextListener: dynamic(
    import("./views/how-it-works/flow-digram-context-listener"),
    {
      ssr: false,
      loading: () => <FlowDiagramLoader />,
    }
  ),
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
