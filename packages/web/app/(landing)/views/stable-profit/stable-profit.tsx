"use client";
import React from "react";
import Image from "next/image";
import fx from "./images/fx.png";
import clsx from "clsx";
import PageWithColumns from "../../../components/page-with-columns/page-with-columns";

import styles from "./stable-profit.module.scss";

interface Props {
  children: React.ReactNode;
}

const StableProfit: React.FC<Props> = ({ children }) => {
  return (
    <PageWithColumns renderImage={renderImage}>{children}</PageWithColumns>
  );
};

function renderImage(isInView: boolean) {
  return (
    <div className={clsx(styles.fx, { [styles["fx--animated"]]: isInView })}>
      <Image src={fx} alt="fx" placeholder="blur" />
    </div>
  );
}

export default StableProfit;
