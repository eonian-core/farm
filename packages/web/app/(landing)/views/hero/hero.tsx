import React from "react";
import Container from "../contrainer/container";
import styles from "./hero.module.scss";

export interface HeroProps {
  children: React.ReactNode;
  description: React.ReactNode;
}

export default function Hero({children, description}: HeroProps) {
  return (
    <Container>
      <div className={styles.hero}>
        {children}
      </div>
    </Container>
  );
}
