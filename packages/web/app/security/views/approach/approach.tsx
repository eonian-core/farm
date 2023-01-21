import React from "react";
import { Inter } from "@next/font/google";
import Container from "../../../components/contrainer/container";
import styles from "./approach.module.scss";

const inter = Inter({
    subsets: ["latin", "cyrillic"],
    display: 'block' // force to show font anyway
});

export interface ApproachProps {
    children: React.ReactNode;
}

export default function Approach({ children }: ApproachProps) {
    return (
        <Container>
            <div className={`${styles.approach} ${inter.className}`}>
                {children}
            </div>
        </Container>
    );
}
