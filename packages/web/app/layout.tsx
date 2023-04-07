import { NEXT_SEO_METADATA } from "../next-seo.config";
import Root from "./root";

export interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return <Root>{children}</Root>;
}

export async function generateMetadata() {
  return NEXT_SEO_METADATA;
}
