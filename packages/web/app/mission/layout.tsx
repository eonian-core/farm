import React from "react";
import { Metadata } from "next";

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}

// Cannot work with `use client`, in our case can be placed only in `layout.tsx`
export const metadata: Metadata = {
  title: "Mission",
  description:
    "Eonian Protocol is a decentralized protocol that allows users to earn interest on their crypto assets",
};
