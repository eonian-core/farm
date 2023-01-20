import React from "react";

import ParallaxContainer from "../../../components/parallax/parallax-container";
import ParallaxBlock from "../../../components/parallax/parallax-block";
import { useWindowSize } from "../../../components/resize-hooks/useWindowSize";
import { useIsDesktopOrSmaller } from "../../../components/resize-hooks/screens";

import styles from "./solution-parallax.module.scss";

export const SolutionParallax = () => {
  const isSmallScreen = useIsDesktopOrSmaller();

  return (
    <ParallaxContainer className={styles.solutionParalax}>
      <ParallaxBlock
        x={!isSmallScreen ? -0.3 : 0.3}
        y={!isSmallScreen ? -1.5 : -0.8}
        scale={0.2}
        spring={{ stiffness: 500, damping: 80, restDelta: 0.001 }}
        className={styles.backgroundTextBox}
        sizeLimits={{ min: 400, max: 600 }}
      >
        <BackgroundText>Eonian</BackgroundText>
      </ParallaxBlock>


    </ParallaxContainer>
  );
}


export default SolutionParallax;

export const BackgroundText = ({children}: {children: React.ReactNode}) => (
  <div className={styles.backgroundText}>
    {children}
  </div>
)