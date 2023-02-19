import React from "react";

import styles from "./features.module.scss";
import Container from "../../../components/contrainer/container";
import clsx from "clsx";
import FadeInList from "../../../components/fade-in/fade-in-list";

export interface ImageProps {
    className: string
}

interface StableProfitProps extends React.PropsWithChildren {
    /** Image which will be rendered */
    image: (props: ImageProps) => React.ReactNode
    /** Show image on right side */
    right?: boolean
}

const Features: React.FC<StableProfitProps> = ({ children, image, right }) => {
    const Image = image({
        className: clsx(styles.image, {[styles.right]: right})
    });

    return (
        <Container>
            <FadeInList className={clsx(styles.wrapper, {[styles.right]: right})} amount={0.3} initialDelay={0}>
                {!right && Image}
                
                <div className={clsx(styles.features, {[styles.right]: right})}>{children}</div>

                {right && Image}
            </FadeInList>
        </Container>
    );
};

export default Features;
