"use client";
import React from "react";
import Container from "../../components/contrainer/container";
import ContentWithColumns from "../../components/page-with-columns/content-with-columns";
import { useInView } from "../../components/use-in-view/use-in-view";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { useWindowSize } from "../../components/resize-hooks/useWindowSize";
import {
  DESKTOP_SCREEN,
  LAPTOP_SCREEN,
} from "../../components/resize-hooks/screens";

import styles from "./page-with-columns.module.scss";

interface Props {
  children: React.ReactNode;
  invert?: boolean;
  renderImage: React.ReactNode | ((isInView: boolean) => React.ReactNode);
}

const PageWithColumns: React.FC<Props> = ({
  children,
  renderImage,
  invert = false,
}) => {
  const ref = React.useRef<HTMLDivElement>(null);

  const isInView = useInView(ref);

  const { x, imageX, opacity, imageOpacity, imageScale } = useProgress(ref, invert);

  return (
    <Container ref={ref} className={styles.container}>
      <motion.div
        style={{ opacity: imageOpacity, x: imageX, scale: imageScale }}
        className={styles.image}
      >
        {typeof renderImage === "function"
          ? renderImage(isInView)
          : renderImage}
      </motion.div>
      <motion.div style={{ x, opacity }}>
        <ContentWithColumns className={styles.columns}>
          {children}
        </ContentWithColumns>
      </motion.div>
    </Container>
  );
};

function useShift(windowWidth: number) {
  if (windowWidth < LAPTOP_SCREEN) {
    return 0;
  }
  if (windowWidth < DESKTOP_SCREEN) {
    return 100;
  }
  return 200;
}

function useProgress<T extends HTMLElement>(
  ref: React.RefObject<T>,
  invert: boolean
) {
  const { width: windowWidth = 0 } = useWindowSize();
  const yViewThreshold = windowWidth < DESKTOP_SCREEN ? "center" : 0.85;
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", `start ${yViewThreshold}`],
  });

  const shift = useShift(windowWidth) * (invert ? -1 : 1);

  return {
    opacity: scrollYProgress,
    imageOpacity: useTransform(scrollYProgress, [0.5, 1], [0, 0.4]),
    imageScale: useSpring(scrollYProgress, {
      stiffness: 200,
      damping: 60,
    }),
    imageX: -shift,
    x: shift,
  };
}

export default PageWithColumns;
