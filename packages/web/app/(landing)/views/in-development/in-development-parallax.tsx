import React from "react";
import Image from "next/image";

import ParallaxContainer from "../../../components/parallax/parallax-container";
import ParallaxBlock from "../../../components/parallax/parallax-block";
import { useIsDesktopOrSmaller } from "../../../components/resize-hooks/screens";

import styles from "./in-development-parallax.module.scss";
import Neon64Pic from './assets/neon-46.png'
import FixedBlock from "../../../components/parallax/fixed-block";


export const InDevelopmentParallax = () => {
  const isSmallScreen = useIsDesktopOrSmaller();

  return (
    <ParallaxContainer>

      <FixedBlock
        x={!isSmallScreen ? 0.8 : 0.6}
        y={!isSmallScreen ? -1.3 : -0.7}
        scale={0.6}
        spring={{ stiffness: 300, damping: 50, restDelta: 0.001 }}
        className={styles.imageBox}
        sizeLimits={{ min: 400, max: 1000 }}
      >
        <NeonImage />
      </FixedBlock>
    </ParallaxContainer>
  );
}


export default InDevelopmentParallax;

export const NeonImage = () => (
  <div className={styles.imageContainer}>
    <Image src={Neon64Pic} alt="Abstract neon cicrle" placeholder="blur" />
  </div>
)
