import React from "react";
import styles from "./problem-parallax.module.scss";
import Image from "next/image";
import clsx from "clsx";

import ParallaxContainer from "../../../components/parallax/parallax-container";
import ParallaxBlock from "../../../components/parallax/parallax-block";

import bitoinCrystalPic from './assets/bitcoin_in_crystal.png'
import ethereumCrystalPic from './assets/ethereum_crystal_2.png'
import pyramidCristalPic from './assets/crystal_4.png'
import { useWindowSize } from "../../../components/resize-hooks/useWindowSize";



export const ProblemParallax = () => {
  const { width } = useWindowSize();
  const isSmallScreen = isSmallerThanDesktop(width || 1);

  return (
    <ParallaxContainer>
      <ParallaxBlock
        x={!isSmallScreen ? -0.1 : 0.3}
        y={!isSmallScreen ? 0.2 : -0.8}
        scale={0.2}
        spring={{ stiffness: 500, damping: 80, restDelta: 0.001 }}
        className={styles.bitcoinBix}
        sizeLimits={{ min: 280, max: 400 }}
      >
        <BitcoinImage />
      </ParallaxBlock>

      <ParallaxBlock
        x={!isSmallScreen ? 0.8 : 0.6}
        y={!isSmallScreen ? -0.5 : -0.7}
        scale={0.12}
        spring={{ stiffness: 300, damping: 50, restDelta: 0.001 }}
        className={styles.ethereumBox}
        sizeLimits={{ min: 170, max: 240 }}
      >
        <EthereumImage />
      </ParallaxBlock>

      <ParallaxBlock
        x={0.6}
        y={1.05}
        scale={0.09}
        className={styles.pyramidBox}
        sizeLimits={{ min: 150, max: 180 }}
      >
        <PyramidImage />
      </ParallaxBlock>

    </ParallaxContainer>
  );
}


export default ProblemParallax;

const desktopWidth = 1280;
const isSmallerThanDesktop = (screenWidth: number) => screenWidth < desktopWidth;

export const BitcoinImage = () => (
  <div className={clsx(styles.imageContainer, styles.bitcoinImageContainer)}>
    <div className={styles.graidentWrapper}>
      <div className={styles.gradientBitcoin1}></div>
      <div className={styles.gradientBitcoin2}></div>
      <div className={styles.gradientBitcoin3}></div>
    </div>
    <Image src={bitoinCrystalPic} alt="Bitcoin crystal" placeholder="blur" />
  </div>
)

export const EthereumImage = () => (
  <div className={clsx(styles.imageContainer, styles.ethereumImageContainer)}>
    <div className={styles.graidentWrapper}>
      <div className={styles.gradientEthereum1}></div>
      <div className={styles.gradientEthereum2}></div>
    </div>
    <Image src={ethereumCrystalPic} alt="Ethereum crystal" placeholder="blur" />
  </div>
)

export const PyramidImage = () => (
  <div className={clsx(styles.imageContainer, styles.crystalPyramidImageContainer)}>
    <div className={styles.graidentWrapper}>
      <div className={styles.gradientPyramid1}></div>
      <div className={styles.gradientPyramid2}></div>
      <div className={styles.gradientPyramid3}></div>
      <div className={styles.gradientPyramid4}></div>
    </div>
    <Image src={pyramidCristalPic} alt="Crystal" placeholder="blur" />
  </div>
)