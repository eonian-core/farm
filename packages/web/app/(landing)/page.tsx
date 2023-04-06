"use client";

import { MDXProvider } from "@mdx-js/react";
import type { MDXComponents } from "mdx/types";
import dynamic from "next/dynamic";
import styles from "./page.module.css";
import Hero from "./views/hero/hero";
import PageLoader from "../components/page-loader/page-loader";
import FlowDiagramLoader from "./views/how-it-works/flow-diagram-loader";
import Mbr from "../components/mobile-break/mobile-break";
import { LinkInText } from "../components/links/link-in-text";
import HeroButtonGroup from "./views/hero/button-group/hero-button-group";
import { client, getVaults, GetVaultsQuery } from "../api";

const components: MDXComponents = {
  Hero, // no lazy loading for Hero, it's the first thing that's rendered
  HeroButtonGroup, // there is also no lazy loading for this component, since we need to have margin styles for this component to avoid content jitter
  HeroButton: dynamic(import("./views/hero/button-group/hero-button"), {
    ssr: false,
  }),
  Mbr, // no lazy loading or it create a flash of content
  a: LinkInText as any, // no lazy loading for links, prevent flash of content
  h2: dynamic(import("../components/heading/heading").then(({ H2 }) => H2)),
  h3: dynamic(import("../components/heading/heading").then(({ H3 }) => H3)),
  EonianIs: dynamic(import("./views/eonian-is/eonian-is")),
  Founders: dynamic(import("./views/founders/founders")),
  FoundersList: dynamic(import("./views/founders/founders-list")),
  Founder: dynamic(import("./views/founders/founder")),
  ExternalLink: dynamic(import("../components/links/external-link")),
  IconLinkedIn: dynamic(import("../components/icons/icon-linkedin")),
  IconTwitter: dynamic(import("../components/icons/icon-twitter")),
  IconExternal: dynamic(import("../components/icons/icon-external")),
  IconDiscord: dynamic(import("../components/icons/icon-discord")),
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
  StableProfit: dynamic(import("./views/stable-profit/stable-profit")),
  SafeInvestments: dynamic(import("./views/safe-investments/safe-investments")),
  Features: dynamic(import("./views/features/features")),
  ul: dynamic(import("./views/features/features-list")),
};

export default function Home() {
  const Content = dynamic(import(`./content/en.mdx`));

  getVaults()
    .then((result: any) => console.log(result));

  return (
    <main className={styles.main}>
      <MDXProvider components={components}>
        <Content />
      </MDXProvider>
    </main>
  );
}
