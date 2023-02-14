import React from "react";
import Image from "next/image";
import PageWithColumns from "../../../components/page-with-columns/page-with-columns";

import styles from "./safe-investments.module.scss";

import image1 from "./images/1.png";
import image2 from "./images/2.png";
import image3 from "./images/3.png";
import image4 from "./images/4.png";
import image5 from "./images/5.png";

const IMAGES = [image1, image2, image3, image4, image5];

interface Props {
  children: React.ReactNode;
}

const SafeInvestments: React.FC<Props> = ({ children }) => {
  return (
    <PageWithColumns
      renderImage={() => <PageSideImage />}
      invert
    >
      {children}
    </PageWithColumns>
  );
};

function PageSideImage() {
  const initialized = React.useRef(false);

  const [imageIndex, setImageIndex] = React.useState(0);
  const [size, setSize] = React.useState({ width: 0, height: 0})

  const handleLoadingComplete = React.useCallback(
    (image: HTMLImageElement) => {
      const index = +image.getAttribute("data-idx")!;
      const nextImageIndex = getNextIndex(imageIndex);
      if (!initialized.current && index === nextImageIndex) {
        setSize({
          width: +image.getAttribute("width")!,
          height: +image.getAttribute("height")!,
        });
        setImageIndex(nextImageIndex);
        initialized.current = true;
      }
    },
    [imageIndex]
  );

  const handleTransitionEnd = React.useCallback(() => {
    const nextImageIndex = getNextIndex(imageIndex);
    setImageIndex(nextImageIndex);
  }, [imageIndex]);

  return (
    <div
      className={styles.imageContainer}
      style={{ width: `${size.width}px`, height: `${size.height}px` }}
    >
      {IMAGES.map((image, index) => {
        const isCurrent = index === imageIndex;
        return (
          <Image
            key={index}
            data-idx={index}
            src={image}
            alt={String(index)}
            placeholder="blur"
            style={{ opacity: !isCurrent || !initialized.current ? 0.0 : 1.0 }}
            onLoadingComplete={handleLoadingComplete}
            onTransitionEnd={handleTransitionEnd}
          />
        );
      })}
    </div>
  );
}

function getNextIndex(idx: number) {
  return idx === IMAGES.length - 1 ? 0 : idx + 1;
}

export default SafeInvestments;
