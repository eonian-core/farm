import { Metadata } from "next";
import Root from "./root";

export interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return <Root>{children}</Root>;
}

export const metadata: Metadata = {
  title: {
    template: "%s | Eonian Protocol",
    default: "Eonian Protocol",
  },
  description:
    "Decentralized and secure protocol for passive investments with peace of mind.",
  openGraph: {
    type: "website",
    locale: "en_IE",
    url: "https://eonian.finance/",
    title: {
      template: "%s | Eonian Protocol",
      default: "Eonian | Crypto yield aggregator that cares about security",
    },
    description:
      "Decentralized and secure real yeild protocol for passive investments with peace of mind.",
    siteName: "Eonian DAO",
  },
  twitter: {
    creator: "@EonianFinance",
    site: "@EonianFinance",
    card: "summary_large_image",
  },
  themeColor: "#181b1b",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  manifest: "/site.webmanifest",
};

export const overrideMetadata = (title: string, description: string): Metadata => {
  return {
    title,
    description,
    openGraph: {
      description,
      title,
    },
  };
};
