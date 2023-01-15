import React from "react";
import styles from "./problem-parallax.module.scss";
import Image from "next/image";
import clsx from "clsx";
import dynamic from "next/dynamic";

export function ProblemParallax() {
    const ParalaxContainer = dynamic(import('../../../components/parallax/parallax-container'), { ssr: false })
    const ParallaxBlock = dynamic(import('../../../components/parallax/parallax-block'), { ssr: false })

   return (
    <ParalaxContainer>
      <ParallaxBlock
        x={-0.1}
        y={0.2}
        scale={0.2}
        spring={{ stiffness: 500, damping: 80, restDelta: 0.001 }}
      >
        <div className={clsx(styles.imageContainer, styles.bitcoinImageContainer)}>
          <div className={styles.graidentWrapper}>
            <div className={styles.gradientBitcoin1}></div>
            <div className={styles.gradientBitcoin2}></div>
            <div className={styles.gradientBitcoin3}></div>
          </div>
          <Image fill src={"/assets/bitcoin_in_crystal.png"} alt="Bitcoin crystal" />
        </div>
      </ParallaxBlock>

      <ParallaxBlock
        x={1.2}
        y={0}
        scale={0.1}
        spring={{ stiffness: 300, damping: 50, restDelta: 0.001 }}
        className={styles.etheriumBox}
      >
        <div className={clsx(styles.imageContainer, styles.etheriumImageContainer)}>
          <div className={styles.graidentWrapper}>
            <div className={styles.gradientEtherium1}></div>
            <div className={styles.gradientEtherium2}></div>
          </div>
          <Image fill src={"/assets/etherium_crystal_2.png"} alt="Etherium crystal" />
        </div>
      </ParallaxBlock>

      <ParallaxBlock
        x={0.6}
        y={0.9}
        scale={0.09}
        className={styles.pyramidBox}
      >
        <div className={clsx(styles.imageContainer, styles.crystalPiramidImageContainer)}>
          <div className={styles.graidentWrapper}>
            <div className={styles.gradientPiramid1}></div>
            <div className={styles.gradientPiramid2}></div>
            <div className={styles.gradientPiramid3}></div>
            <div className={styles.gradientPiramid4}></div>
          </div>
          <Image fill src={"/assets/crystal_4.png"} alt="Crystal" />
        </div>
      </ParallaxBlock>

    </ParalaxContainer>
  );
}

export default ProblemParallax;
