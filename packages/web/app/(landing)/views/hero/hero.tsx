import React from "react";
import { Inter } from "@next/font/google";
import Container from "../../../components/contrainer/container";
import styles from "./hero.module.scss";

const inter = Inter({
  subsets: ["latin", "cyrillic"],
  display: 'block' // force to show font anyway
});

export interface HeroProps {
  children: React.ReactNode;
  description: React.ReactNode;
}

export default function Hero({ children, description }: HeroProps) {
  return (
    <Container>
      <div className={`${styles.hero} ${inter.className}`}>
        {children}
      </div>
    </Container>
  );
}
