import React from "react";
import styles from "./deepsecurity.module.scss";

export interface DeepSecurityProps {
  children: React.ReactNode;
}

export default function DeepSecurity({
  children,
}: DeepSecurityProps) {
  return (
      <div className={styles.deepSecurity}>
        {children}
      </div>
  );
}
