import React from "react";
import styles from "./approach.module.scss";

export interface ApproachProps {
    children: React.ReactNode;
}

export default function Approach({ children }: ApproachProps) {
    return (
        <div className={styles.approach}>
            {children}
        </div>
    );
}
