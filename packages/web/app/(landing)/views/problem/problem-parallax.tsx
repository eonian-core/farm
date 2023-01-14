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

export function ProblemParallax() {
  const ref = React.useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  return (
    <div ref={ref} className={styles.container}>
      <FloatingCrystal
        src="/assets/bitcoin_in_crystal.png"
        x={-0.05}
        y={0.45}
        fade={0.1}
        animationProgress={scrollYProgress}
      />
      <FloatingCrystal
        src="/assets/etherium_crystal_2.png"
        x={0.5}
        y={-0.05}
        scale={0.75}
        fade={0.4}
        animationProgress={scrollYProgress}
      />
      <FloatingCrystal
        src="/assets/crystal_3.png"
        x={1.15}
        y={0.2}
        scale={0.65}
        fade={0.7}
        animationProgress={scrollYProgress}
      />
      <FloatingCrystal
        src="/assets/crystal_5.png"
        x={0.9}
        y={1}
        scale={0.65}
        fade={0.5}
        animationProgress={scrollYProgress}
      />
      <FloatingCrystal
        src="/assets/crystal_4.png"
        x={0.2}
        y={1.1}
        scale={0.65}
        fade={0.5}
        animationProgress={scrollYProgress}
      />
    </div>
  );
}

interface FloatingCrystalProps {
  src: string;
  x: number;
  y: number;
  animationProgress: MotionValue<number>;
  scale?: number;
  fade?: number;
  blur?: number;
  size?: number;
}

function FloatingCrystal({
  src,
  x,
  y,
  animationProgress,
  scale = 1,
  fade = 0,
  blur = 0,
  size = 256,
}: FloatingCrystalProps) {
  const halfSize = size / 2;
  const translate = 100 * (1.5 - y) * scale;
  const willChange = useWillChange();
  const transform = useTransform(
    animationProgress,
    [1, 0],
    [-translate - halfSize, translate - halfSize]
  );
  const ys = useSpring(transform, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <motion.div
      className={styles.imageWrapper}
      style={
        {
          filter: `blur(${blur}px)`,
          left: `${x * 100}%`,
          top: `${y * 100}%`,
          width: `${size * scale}px`,
          height: `${size * scale}px`,
          "--start-fade-offset": `${(1 - fade) * 100}%`,
          willChange,
          y: ys,
          x: -halfSize,
        } as MotionStyle
      }
    >
      <Image fill src={src} alt="crystal" />
    </motion.div>
  );
}

export default ProblemParallax;
