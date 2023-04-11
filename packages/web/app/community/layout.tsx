import { Metadata } from "next";

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}

export const metadata: Metadata = {
  title: "Community",
  description:
    "Join the Eonian growing community and make your contribution to the future of investments!",
};
