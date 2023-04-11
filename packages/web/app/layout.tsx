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
    title: "Eonian | Crypto yield aggregator that cares about security",
    description:
      "Decentralized and secure real yeild protocol for passive investments with peace of mind.",
    images: [
      {
        url: "https://eonian.finance/assets/preview-open-graph.png",
        width: 1024,
        height: 697,
        alt: "Make crypto work for you",
        type: "image/png",
      },
    ],
    siteName: "Eonian DAO",
  },
  twitter: {
    creator: "@EonianFinance",
    site: "@EonianFinance",
    card: "summary_large_image",
  },
  manifest: "/site.webmanifest",
  icons: {
    icon: [
      { type: "image/png", sizes: "32x32", url: "/favicon-32x32.png" },
      { type: "image/png", sizes: "16x16", url: "/favicon-16x16.png" },
    ],
    shortcut: "/favicon.ico",
    apple: { url: "/apple-touch-icon.png", sizes: "180x180" },
  },
  themeColor: "#181b1b",
  other: {
    "msapplication-TileColor": "#181b1b",
    "msapplication-config": "/browserconfig.xml",
  },
};
