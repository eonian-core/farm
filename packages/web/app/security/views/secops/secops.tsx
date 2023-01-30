import React from "react";
import styles from "./secops.module.scss";

export interface SecOpsProps {
  children: React.ReactNode;
}

export default function SecOps({
  children,
}: SecOpsProps) {
  return (
      <div className={styles.secOps}>
          {children}
      </div>
  );
}
