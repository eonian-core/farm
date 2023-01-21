import React from "react";
import Image from "next/image";
import robotPic from "../../assets/robot.png";
import Row from "../../rows/rows";
import Column from "../../columns/columns";

export interface ApproachDescriptionProps {
    children: React.ReactNode;
}

export default function ApproachDescription({ children }: ApproachDescriptionProps) {
    return (
        <Row>
            <Image src={robotPic} alt="robot protecting vault" placeholder="blur"/>
            <Column>
                {children}
            </Column>
        </Row>
    );
}
