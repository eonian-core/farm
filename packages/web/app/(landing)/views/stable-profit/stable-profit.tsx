import React, { useCallback } from "react";
import Image from "next/image";
import clsx from "clsx";

import styles from "./stable-profit.module.scss";
import citySrc from "./assets/sci-fi-city-with-rocket.png";
import Features, { ImageProps } from "../features/features";


const StableProfit: React.FC<React.PropsWithChildren> = ({ children }) => (
    <Features image={CityPic}>
      {children}
    </Features>
  );

const CityPic = ({className}: ImageProps) =>
  <div className={clsx(className, styles.image)}>
    <Image src={citySrc} alt="sci-fy cityscape with launching rocket" placeholder="blur" />
  </div>


export default StableProfit;
