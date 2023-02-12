import React, { useEffect } from "react";
import Image from "next/image";
import PageWithColumns from "../../../components/page-with-columns/page-with-columns";

import styles from "./safe-investments.module.scss";

import image1 from "./images/1.png";
import image2 from "./images/2.png";
import image3 from "./images/3.png";
import image4 from "./images/4.png";
import image5 from "./images/5.png";

const IMAGE_CHANGE_INTERVAL = 1000;
const IMAGES = [image1, image2, image3, image4, image5];

interface Props {
  children: React.ReactNode;
}

const SafeInvestments: React.FC<Props> = ({ children }) => {
  return (
    <PageWithColumns
      renderImage={(isInView) => <PageSideImage isInView={isInView} />}
      invert
    >
      {children}
    </PageWithColumns>
  );
};

function PageSideImage(props: { isInView: boolean }) {
  const { isInView } = props;

  const once = React.useRef(false);

  const [isReady, setIsReady] = React.useState(false);
  const [isLoaded, setIsLoaded] = React.useState(false);

  const [imageIndex, setImageIndex] = React.useState(0);
  const [nextImageIndex, setNextImageIndex] = React.useState(2);

  const handleLoadingComplete = React.useCallback(() => {
    setIsLoaded(true);
  }, []);

  React.useEffect(() => {
    if (isLoaded && isInView && !once.current) {
      setIsReady(true);
      once.current = true;
    }
  }, [isLoaded, isInView]);

  const handleTransitionEnd = React.useCallback(() => {
    if (isReady) {
      const nextIndex = getNextIndex(imageIndex);
      setImageIndex(nextIndex);
    } else {
      const nextIndex = getNextIndex(nextImageIndex);
      setNextImageIndex(nextIndex);
    }
    setIsReady(!isReady);
  }, [imageIndex, isReady, nextImageIndex]);

  return (
    <div className={styles.imageContainer}>
      <Image
        src={IMAGES[imageIndex]}
        alt={String(imageIndex)}
        placeholder="blur"
        onLoadingComplete={handleLoadingComplete}
        fill
        style={{ opacity: isReady ? 0.0 : 1.0 }}
      />
      <Image
        src={IMAGES[nextImageIndex]}
        alt={String(nextImageIndex)}
        placeholder="blur"
        style={{ opacity: isReady ? 1.0 : 0.0 }}
        onTransitionEnd={handleTransitionEnd}
      />
    </div>
  );
}

function getNextIndex(idx: number) {
  return idx === IMAGES.length - 1 ? 0 : idx + 1;
}

export default SafeInvestments;
