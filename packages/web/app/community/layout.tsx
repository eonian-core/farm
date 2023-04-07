import { generatePageSpecificMetadata } from "../../next-seo.config";

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}

export async function generateMetadata() {
  return generatePageSpecificMetadata({
    title: "Eonian | Community",
    description:
      "Join the Eonian growing community and make your contribution to the future of investments!",
  });
}
