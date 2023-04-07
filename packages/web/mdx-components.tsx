"use client";

import type { MDXComponents } from "mdx/types";

import Card, { Target } from "./app/components/card/card";
import EonianIs from "./app/(landing)/views/eonian-is/eonian-is";
import HeroButton from "./app/(landing)/views/hero/button-group/hero-button";
import HeroButtonGroup from "./app/(landing)/views/hero/button-group/hero-button-group";
import Hero from "./app/(landing)/views/hero/hero";
import Mbr from "./app/components/mobile-break/mobile-break";
import { LinkInText } from "./app/components/links/link-in-text";
import { H2, H3 } from "./app/components/heading/heading";
import Features from "./app/(landing)/views/features/features";
import Founder from "./app/(landing)/views/founders/founder";
import Founders from "./app/(landing)/views/founders/founders";
import FoundersList from "./app/(landing)/views/founders/founders-list";
import FlowDiagramContextListener from "./app/(landing)/views/how-it-works/flow-digram-context-listener";
import FlowSlider from "./app/(landing)/views/how-it-works/flow-slider";
import FlowSliderItem from "./app/(landing)/views/how-it-works/flow-slider-item";
import HowItWorks from "./app/(landing)/views/how-it-works/how-it-works";
import InDevelopment from "./app/(landing)/views/in-development/in-development";
import Roadmap from "./app/(landing)/views/roadmap/roadmap";
import RoadmapCheckpoint from "./app/(landing)/views/roadmap/roadmap-checkpoint";
import RoadmapContainer from "./app/(landing)/views/roadmap/roadmap-container";
import RoadmapDate from "./app/(landing)/views/roadmap/roadmap-date";
import SafeInvestments from "./app/(landing)/views/safe-investments/safe-investments";
import StableProfit from "./app/(landing)/views/stable-profit/stable-profit";
import IconDiscord from "./app/components/icons/icon-discord";
import IconExternal from "./app/components/icons/icon-external";
import IconLinkedIn from "./app/components/icons/icon-linkedin";
import IconTwitter from "./app/components/icons/icon-twitter";
import ExternalLink from "./app/components/links/external-link";
import FeaturesList from "./app/(landing)/views/features/features-list";
import dynamic from "next/dynamic";

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...components,
    Card,
    Hero,
    HeroButtonGroup,
    HeroButton,
    Mbr,
    a: LinkInText as any,
    h2: H2,
    h3: H3,
    EonianIs,
    Founders: dynamic(import("./app/(landing)/views/founders/founders")),
    FoundersList: dynamic(import("./app/(landing)/views/founders/founders-list")),
    Founder: dynamic(import("./app/(landing)/views/founders/founder")),
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
}
