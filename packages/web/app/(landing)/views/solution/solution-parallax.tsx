import React from "react";

import Image from "next/image";
import clsx from "clsx";

import ParallaxContainer from "../../../components/parallax/parallax-container";
import ParallaxBlock from "../../../components/parallax/parallax-block";
import { useWindowSize } from "../../../components/resize-hooks/useWindowSize";

import vaultPic from './assets/vault.png'
import styles from "./solution-parallax.module.scss";




export const SolutionParallax = () => {
  const { width } = useWindowSize();
  const isSmallScreen = isSmallerThanDesktop(width || 1);

  return (
    <ParallaxContainer>
      <ParallaxBlock
        x={!isSmallScreen ? -0.3 : 0.3}
        y={!isSmallScreen ? 0.2 : -0.8}
        scale={0.2}
        spring={{ stiffness: 500, damping: 80, restDelta: 0.001 }}
        className={styles.vaultBox}
        sizeLimits={{ min: 280, max: 400 }}
      >
        <VaultImage />
      </ParallaxBlock>


    </ParallaxContainer>
  );
}


export default SolutionParallax;

const desktopWidth = 1280;
const isSmallerThanDesktop = (screenWidth: number) => screenWidth < desktopWidth;

export const VaultImage = () => (
  <div className={clsx(styles.imageContainer, styles.vaultImageContainer)}>
    <div className={styles.graidentWrapper}>
      <div className={styles.gradientVault1}></div>
      <div className={styles.gradientVault2}></div>
      <div className={styles.gradientVault3}></div>
    </div>
    <Image src={vaultPic} alt="Futuristic bank vault" placeholder="blur" />
  </div>
)

