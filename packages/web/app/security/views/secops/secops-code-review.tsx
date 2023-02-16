import React from "react";
import ImageCard from "../../../components/image-card/image-card";
import {StaticImageData} from 'next/dist/client/image';
import {useIsLaptopOrSmaller} from "../../../components/resize-hooks/screens";

export interface SecOpsCodeReviewProps {
    /** Link to external page */
    href: string
    /** Path to image */
    image: StaticImageData
    /** Alt image name */
    alt: string
    /** Vertical orientation */
    isVertical: boolean
    /**
     * Children of card
     * expect one h3 header and one p element and Target component
     * */
    children: React.ReactNode
}

export default function SecOpsCodeReview({href, image, alt = '', children}: SecOpsCodeReviewProps) {
    const isLaptopOrSmaller = useIsLaptopOrSmaller()

    return (
        <ImageCard href={href} image={image} alt={alt} isVertical={!!isLaptopOrSmaller}>
            {children}
        </ImageCard>
    );
}
