import Image from 'next/image'

import { PropsWithChildren } from "react";
import Container from "../../../components/contrainer/container";
import FadeIn from "../../../components/fade-in/fade-in";
import styles from './who-are-we.module.scss'
import futurePic from './assets/space-rocket-starting-in-scify-city.png'


export const WhoWeAre = ({children}: PropsWithChildren) => {
    return (
        <Container>
            <FadeIn className={styles.whoAreWe} delay={0.3} amount={0.1}>
                <div className={styles.content}>
                    {children}
                </div>

                <div className={styles.imageContainer}>
                    <Image src={futurePic} alt="Rocket starting in cityscape of future city" placeholder="blur" />
                </div>
            </FadeIn>
        </Container>
    )
}

export default WhoWeAre;