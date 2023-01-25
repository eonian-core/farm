import React from "react";
import styles from "./deepsecurity.module.scss";
import Image from "next/image";
import robotPic from "../../assets/robot.png";
import Column from "../../columns/columns";

export interface DeepSecurityProps {
  children: React.ReactNode;
}

export default function DeepSecurity({
  children,
}: DeepSecurityProps) {
  return (
    <>
      <div className={styles.painting}>
        <Image className={styles.robotImage} src={robotPic} alt="robot protecting vault" placeholder="blur" />
      </div>
      <Column>{children}</Column>
    </>
  );
}
