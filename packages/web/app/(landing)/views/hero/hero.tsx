import React from "react";
import { Roboto } from "@next/font/google";
import Container from "../contrainer/container";
import styles from "./hero.module.scss";

const roboto = Roboto({ subsets: ['latin'], weight: ['400', '700', '900'] })

export interface HeroProps {
  children: React.ReactNode;
  description: React.ReactNode;
}

export default function Hero({children, description}: HeroProps) {
  return (
    <Container>
      <div className={styles.hero}>
        <h1 className={roboto.className}>
         {children}
        </h1>
        <p className={roboto.className}>
          {description}
        </p>
      </div>
    </Container>
  );
}
