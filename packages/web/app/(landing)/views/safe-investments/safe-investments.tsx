import React, { useCallback } from "react";
import Image from "next/image";
import clsx from "clsx";

import styles from "./safe-investments.module.scss";
import Features, { ImageProps } from "../features/features";
import citySrc from "./assets/sci-fi-city-near-to-sea.png";


const SafeInvestments: React.FC<React.PropsWithChildren> = ({ children }) => (
    <Features image={CityPic} right className={styles.safeInvestments}>
      {children}
    </Features>
  );

const CityPic = ({className}: ImageProps) =>
  <div className={clsx(className, styles.image)}>
    <Image src={citySrc} alt="sci-fy cityscape from sea" placeholder="blur" />
  </div>


export default SafeInvestments;
