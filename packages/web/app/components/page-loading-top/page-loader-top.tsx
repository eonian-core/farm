"use client";

import React from "react";
import styles from "./page-loader-top.module.scss";
import {
  usePathname,
  useSearchParams,
} from "next/dist/client/components/navigation";
import { usePageTransitionContext } from "../../store/page-transition-context";

const PageLoaderTop = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [pageLoading] = usePageTransitionContext();

  const ref = React.useRef<HTMLDivElement>(null);
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
    const animation = loader.animate(loaderProgress, {
      duration: 5000,
      fill: "forwards",
    });
    animation.cancel();
    setAnimation(animation);
  }, []);

  React.useEffect(() => {
    if (!animation || !pageLoading) {
      return;
    }
    const url = pathname + searchParams.toString();
    if (!pageLoading || pageLoading === url) {
      animation?.finish();
      setTimeout(() => animation.cancel(), 100);
    } else {
      animation?.play();
    }
  }, [pathname, searchParams, pageLoading, animation]);
  return <div ref={ref} className={styles.loader} />;
};

export default PageLoaderTop;
