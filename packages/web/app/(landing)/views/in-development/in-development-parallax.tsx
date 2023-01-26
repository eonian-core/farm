import React from "react";
import Image from "next/image";

import ParallaxContainer from "../../../components/parallax/parallax-container";
import ParallaxBlock from "../../../components/parallax/parallax-block";
import { ScreenName, useIsDesktopOrSmaller, useScreenName } from "../../../components/resize-hooks/screens";

import styles from "./in-development-parallax.module.scss";
import Neon64Pic from './assets/neon-46.png'
import FixedBlock from "../../../components/parallax/fixed-block";

const BackgroundTextScreenMap = {
  [ScreenName.ULTRA_WIDE]: { x: 0.3, y: -1.4 },
  [ScreenName.DESKTOP]: { x: 0.35, y: -1.4 },
  [ScreenName.LAPTOP]: { x: 0.5, y: -1.1 },
  [ScreenName.TABLET]: { x: 0.25, y: -1.55 },
  [ScreenName.MOBILE]: { x: 0.1, y: '-60rem' },
  [ScreenName.SMALL_MOBILE]: { x: -0.05, y: '-27rem' },
}

export const InDevelopmentParallax = () => {
  const screen = useScreenName();
  const position = BackgroundTextScreenMap[screen || ScreenName.DESKTOP]
  const isSmallMobile = screen === ScreenName.SMALL_MOBILE

  return (
    <ParallaxContainer>

      <FixedBlock
        {...position}
        spring={{ stiffness: 300, damping: 50, restDelta: 0.001 }}
        className={styles.imageBox}
        threshold={!isSmallMobile ? 0.5 : 0.1}
        scale={{
          multiplier: !isSmallMobile ? 0.8 : 2,
          accselerator: !isSmallMobile ? 0.6 : 0.8,
        }}
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
