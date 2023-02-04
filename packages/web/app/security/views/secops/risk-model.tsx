import React from "react";
import styles from "./secops.module.scss";
import Column from "../../columns/columns";
import Image from "next/image";
import umbrellaPic from "../../assets/umbrella.png";

export interface RiskModelProps {
  children: React.ReactNode;
}

export default function RiskModel({ children }: RiskModelProps) {
  return (
    <Column>
        <div className={styles.paintingUmbrella}>
            <Image className={styles.robotImage} src={umbrellaPic} alt="umbrella from risks" placeholder="blur" />
        </div>
        {children}
    </Column>
  );
}
