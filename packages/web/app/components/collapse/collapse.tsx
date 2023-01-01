import styles from "./collapse.module.scss";
import React from "react";

interface CollapseProp {
  index: number;
  label: string;
  children: React.ReactNode;
}

export default function Collapse({ index = 0, label, children }: CollapseProp) {
  return (
    <div className={styles.container}>
      <div
        tabIndex={index}
        className="collapse-arrow rounded-box collapse border border-base-300 bg-base-100"
      >
        <div className="collapse-title text-xl font-medium">{label}</div>
        <div className="collapse-content">
            {children}
        </div>
      </div>
    </div>
  );
}
