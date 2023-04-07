import React from "react";
import { generatePageSpecificMetadata } from "../../next-seo.config";

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}

export async function generateMetadata() {
  return generatePageSpecificMetadata({
    title: "Eonian | Mission",
    description:
      "Eonian Protocol is a decentralized protocol that allows users to earn interest on their crypto assets",
  });
}
