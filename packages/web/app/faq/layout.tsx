import { Metadata } from 'next';

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}

export const metadata: Metadata = {
  title: "FAQ",
  description: "Frequently asked questions about Eonain, DeFi and crypto",
};
