import React from "react";
import styles from "./deepsecurity.module.scss";
import Image from "next/image";
import electronicCircuitPic from "../../assets/electronics-circuit.png";

export interface DeepSecurityProps {
    children: React.ReactNode;
}

export default function DeepSecurity({
                                         children,
                                     }: DeepSecurityProps) {
    return (
        <div className={styles.deepSecurity}>
            {children}
            <div className={styles.imageContainer}>
                <Image src={electronicCircuitPic} alt="Rocket starting in cityscape of future city" placeholder="blur"/>
            </div>
        </div>
    );
}
