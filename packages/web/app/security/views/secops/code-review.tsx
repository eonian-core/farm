import React from "react";
import styles from "./secops.module.scss";
import Row from "../../rows/rows";
import Image from "next/image";
import magnifierPic from "../../assets/magnifier.png";

export interface RiskModelProps {
  children: React.ReactNode;
}

export default function CodeReview({ children }: RiskModelProps) {
  return (
    <Row>
        <div className={styles.paintingUmbrella}>
            <Image className={styles.robotImage} src={magnifierPic} alt="magnifier for source code review" placeholder="blur" />
        </div>
        {children}
    </Row>
  );
}
