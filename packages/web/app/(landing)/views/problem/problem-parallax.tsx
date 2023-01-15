import React from "react";
import styles from "./problem-parallax.module.scss";
import Image from "next/image";
import {
  motion,
  MotionStyle,
  useScroll,
  useWillChange,
  useTransform,
  useSpring,
  MotionValue,
} from "framer-motion";
import { ParalaxContainer } from "../../../components/parallax/parallax-container";
import { ParallaxBlock } from "../../../components/parallax/parallax-block";
import clsx from "clsx";

export function ProblemParallax() {
  const ref = React.useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  return (
    <ParalaxContainer>
      <ParallaxBlock
        x={-0.05}
        y={0.45}
        scale={0.2}
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
        x={1}
        y={0.2}
        scale={0.1}
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
