import React from "react";
import Image from "next/image";
import clsx from "clsx";

import styles from "./features.module.scss";
import Container from "../../../components/contrainer/container";
import citySrc from "./assets/sci-fi-city-with-rocket.png";

interface StableProfitProps extends React.PropsWithChildren {

}

const Features: React.FC<StableProfitProps> = ({ children }) => {
    return (
        <Container>
            <div className={styles.wrapper}>
                <div className={styles.image}>
                    <Image src={citySrc} alt="sci-fy cityscape with launching rocket" placeholder="blur" />
                </div>

                <div className={styles.features}>{children}</div>

            </div>
        </Container>
    );
};

export default Features;
