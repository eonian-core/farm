import React from "react";
import styles from "./problem-parallax.module.scss";
import Image from "next/image";
import clsx from "clsx";

import ParallaxContainer from "../../../components/parallax/parallax-container";
import ParallaxBlock from "../../../components/parallax/parallax-block";

import bitoinCrystalPic from './assets/bitcoin_in_crystal.png'
import ethereumCrystalPic from './assets/ethereum_crystal_2.png'
import piramidCristalPic from './assets/crystal_4.png'


export const ProblemParallax = () => (
  <ParallaxContainer>
    <ParallaxBlock
      x={-0.1}
      y={0.2}
      scale={0.2}
      spring={{ stiffness: 500, damping: 80, restDelta: 0.001 }}
    >
      <BitcoinImage />
    </ParallaxBlock>

    <ParallaxBlock
      x={0.8}
      y={-0.5}
      scale={0.12}
      spring={{ stiffness: 300, damping: 50, restDelta: 0.001 }}
      className={styles.ethereumBox}
    >
      <EthereumImage />
    </ParallaxBlock>

    <ParallaxBlock
      x={0.6}
      y={1.05}
      scale={0.09}
      className={styles.pyramidBox}
    >
      <PyramidImage />
    </ParallaxBlock>

  </ParallaxContainer>
);


export default ProblemParallax;

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
  <div className={clsx(styles.imageContainer, styles.crystalPiramidImageContainer)}>
    <div className={styles.graidentWrapper}>
      <div className={styles.gradientPiramid1}></div>
      <div className={styles.gradientPiramid2}></div>
      <div className={styles.gradientPiramid3}></div>
      <div className={styles.gradientPiramid4}></div>
    </div>
    <Image src={piramidCristalPic} alt="Crystal" placeholder="blur" />
  </div>
)