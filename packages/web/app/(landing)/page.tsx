"use client";

import styles from "./page.module.css";

import Content from "./content/en.mdx";

import { MDXProvider } from "@mdx-js/react";
import { H2, H3 } from "../components/heading/heading";
import IconDiscord from "../components/icons/icon-discord";
import IconExternal from "../components/icons/icon-external";
import IconTwitter from "../components/icons/icon-twitter";
import IconLinkedIn from "../components/icons/icon-linkedin";
import ExternalLink from "../components/links/external-link";
import { LinkInText } from "../components/links/link-in-text";
import Mbr from "../components/mobile-break/mobile-break";
import EonianIs from "./views/eonian-is/eonian-is";
import Features from "./views/features/features";
import FeaturesList from "./views/features/features-list";
import HeroButton from "./views/hero/button-group/hero-button";
import HeroButtonGroup from "./views/hero/button-group/hero-button-group";
import Hero from "./views/hero/hero";
import FlowDiagramContextListener from "./views/how-it-works/flow-digram-context-listener";
import FlowSlider from "./views/how-it-works/flow-slider";
import FlowSliderItem from "./views/how-it-works/flow-slider-item";
import HowItWorks from "./views/how-it-works/how-it-works";
import InDevelopment from "./views/in-development/in-development";
import Roadmap from "./views/roadmap/roadmap";
import RoadmapCheckpoint from "./views/roadmap/roadmap-checkpoint";
import RoadmapContainer from "./views/roadmap/roadmap-container";
import RoadmapDate from "./views/roadmap/roadmap-date";
import SafeInvestments from "./views/safe-investments/safe-investments";
import StableProfit from "./views/stable-profit/stable-profit";
import Card, { Target } from "../components/card/card";
import Founders from "./views/founders/founders";
import FoundersList from "./views/founders/founders-list";
import Founder from "./views/founders/founder";

const components = {
  Card,
  Hero,
  HeroButtonGroup,
  HeroButton,
  Mbr,
  a: LinkInText as any,
  h2: H2,
  h3: H3,
  EonianIs,
  Founders,
  FoundersList,
  Founder,
  ExternalLink,
  IconLinkedIn,
  IconTwitter,
  IconExternal,
  IconDiscord,
  Roadmap,
  RoadmapCheckpoint,
  RoadmapContainer,
  RoadmapDate,
  InDevelopment,
  Target,
  HowItWorks,
  FlowSlider,
  FlowSliderItem,
  FlowDiagramContextListener,
  StableProfit,
  SafeInvestments,
  Features,
  ul: FeaturesList,
};

export default function Home() {
  return (
    <main className={styles.main}>
      <MDXProvider components={components}>
        <Content />
      </MDXProvider>
    </main>
  );
}
