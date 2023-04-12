import { Metadata } from "next";

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}

// Cannot work with `use client`, in our case can be placed only in `layout.tsx`
export const metadata: Metadata = {
  title: "Community",
  description:
    "Join the Eonian growing community and make your contribution to the future of investments!",
};
