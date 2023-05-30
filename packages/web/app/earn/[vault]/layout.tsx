import { Metadata } from "next";
import { overrideMetadata } from "../../layout";

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}

export const metadata: Metadata = overrideMetadata(
  "Earn",
  "Eonain Earn Application"
);
