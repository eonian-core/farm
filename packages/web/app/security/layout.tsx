import { Metadata } from "next";
import { overrideMetadata } from "../meta";

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}

// Cannot work with `use client`, in our case can be placed only in `layout.tsx`
export const metadata: Metadata = overrideMetadata(
  "Security",
  "Eonain Security measures overview"
);
