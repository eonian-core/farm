import React from "react";
import styles from "./deepsecurity.module.scss";
import Image from "next/image";
import electronicCircuitPic from "./assets/electronics-circuit.png";
import FadeIn from "../../../components/fade-in/fade-in";
import {useIsMobileOrSmaller} from "../../../components/resize-hooks/screens";

export interface DeepSecurityProps {
    children: React.ReactNode;
}

export default function DeepSecurity({
                                         children,
                                     }: DeepSecurityProps) {
    const isMobileOrSmaller = useIsMobileOrSmaller()

    return (
        <div className={styles.deepSecurity}>
            {children}
            <FadeIn className={styles.imageContainer} amount={!isMobileOrSmaller ? 0.2 : 0.1} delay={0}>
                <Image src={electronicCircuitPic} alt="Electronics circuit board with locks" placeholder="blur"/>
            </FadeIn>
        </div>
    );
}
