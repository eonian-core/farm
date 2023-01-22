import React from "react";

import ParallaxContainer from "../../../components/parallax/parallax-container";
import ParallaxBlock from "../../../components/parallax/parallax-block";
import { ScreenName, useScreenName } from "../../../components/resize-hooks/screens";

import styles from "./solution-parallax.module.scss";

const BackgroundTextScreenMap = {
  [ScreenName.ULTRA_WIDE]: {x: 1, y: -1.5}, 
  [ScreenName.DESKTOP]: {x: 0.7, y: -1.5},
  [ScreenName.LAPTOP]: {x: 0.9, y: -1.5},
  [ScreenName.TABLET]: {x: 0.75, y: -1.2},
  [ScreenName.MOBILE]: {x: 0.6, y: -1.1},
  [ScreenName.SMALL_MOBILE]: {x: 0.4, y: -0.8},
}

export const SolutionParallax = () => {
  const screen = useScreenName();
  const {x, y} = BackgroundTextScreenMap[screen || ScreenName.DESKTOP]
  
  return (
    <ParallaxContainer className={styles.solutionParalax}>
      <ParallaxBlock
        x={x}
        y={y}
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