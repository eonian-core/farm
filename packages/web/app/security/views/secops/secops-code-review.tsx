import React from "react";
import ImageCard from "../../../components/image-card/image-card";
import {useIsDesktopOrSmaller} from "../../../components/resize-hooks/screens";
import magnifierPic from "./assets/magnifier.png";

export interface SecOpsCodeReviewProps {
    /**
     * Children of card
     * expect one h3 header and one p element and Target component
     * */
    children: React.ReactNode
}

export default function SecOpsCodeReview({children}: SecOpsCodeReviewProps) {
    const isDesktopOrSmaller = useIsDesktopOrSmaller()

    return (
        <ImageCard
            href={'/security/all-reviews'}
            image={magnifierPic}
            alt={'robot picture'}
            isVertical={!!isDesktopOrSmaller}
            disabled
        >
            {children}
        </ImageCard>
    );
}
