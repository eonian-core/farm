"use client";

import React from "react";
import styles from "./page-loader-top.module.scss";
import { usePathname } from "next/navigation";
import { usePageTransitionContext } from "../../store/page-transition-context";

const PageLoaderTop = () => {
  const ref = React.useRef<HTMLDivElement>(null);

  const pathname = usePathname();
  const [pageLoading] = usePageTransitionContext();

  const [animation, setAnimation] = React.useState<Animation | null>(null);

  React.useEffect(() => {
    const { current: loader } = ref;
    if (!loader) {
      return;
    }
    const loaderProgress = [
      { width: "0", opacity: 0.5 },
      { width: "20vw", opacity: 0.9, offset: 0.1 },
      { width: "40vw", opacity: 1, offset: 0.3 },
      { width: "60vw", opacity: 0.9, offset: 0.5 },
      { width: "100vw", opacity: 0.75 },
    ];
    const newAnimation = loader.animate(loaderProgress, {
      duration: 5000,
      fill: "forwards",
    });
    newAnimation.cancel();
    return setAnimation(newAnimation);
  }, []);

  React.useEffect(() => {
    if (!pageLoading || !animation) {
      return;
    }

    if (pageLoading !== pathname) {
      animation.play();
      return;
    }

    animation.finish();
    const timeout = setTimeout(() => animation.cancel(), 100);
    return () => clearTimeout(timeout);
  }, [pathname, pageLoading, animation]);

  return <div ref={ref} className={styles.loader} />;
};

export default PageLoaderTop;
