import { generatePageSpecificMetadata } from '../../next-seo.config';

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}

export async function generateMetadata() {
  return generatePageSpecificMetadata({
    title: "Eonain | Security",
    description: "Eonain Security measures overview",
  });
}

