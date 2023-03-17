import React from 'react'
import ImageCard from "../../../components/image-card/image-card";
import umbrellaPic from "../../assets/umbrella.png";

/** Props for Card component */
export interface SecOpsRiskThreatModelProps {
    /**
     * Children of card
     * expect one h3 header and one p element and Target component
     * */
    children: React.ReactNode
}

/** Card component which primarly wraps block with header and text as card  */
export default function SecOpsRiskThreatModel({children}: SecOpsRiskThreatModelProps) {
    return (
        <ImageCard
            href={'/security/full-list'}
            image={umbrellaPic}
            alt={'umbrella picture'}
            isVertical={true}
            disabled
        >
            {children}
        </ImageCard>
    );
}
