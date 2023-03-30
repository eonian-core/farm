import React from "react";
import Image from 'next/image';
import ImageCard from "../../../components/image-card/image-card";
import {useIsTabletOrSmaller} from "../../../components/resize-hooks/screens";
import magnifierPic from "./assets/magnifier.png";
import styles from "./secops.module.scss";

export interface SecOpsCodeReviewProps {
    /**
     * Children of card
     * expect one h3 header and one p element and Target component
     * */
    children: React.ReactNode
}

export default function SecOpsCodeReview({children}: SecOpsCodeReviewProps) {
    const isTabletOrSmaller = useIsTabletOrSmaller()

    return (
        <ImageCard
            href={'/security/all-reviews'}
            image={
                <Image 
                    src={magnifierPic} 
                    alt={'robot picture'} 
                    placeholder="blur" />
            }
            isVertical={!!isTabletOrSmaller}
            className={styles.secOpsImageCard}
            disabled
        >
            {children}
        </ImageCard>
    );
}
