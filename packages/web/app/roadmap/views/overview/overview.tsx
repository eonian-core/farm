import Image from 'next/image'

import { PropsWithChildren } from "react";
import Container from "../../../components/contrainer/container";
import FadeIn from "../../../components/fade-in/fade-in";
import styles from './overview.module.scss'
import rocketPic from './assets/rocket-launch.png'
import FadeInList from '../../../components/fade-in/fade-in-list';
import { useIsLaptopOrSmaller } from '../../../components/resize-hooks/screens';


export const Overview = ({children}: PropsWithChildren) => {
    const isLaptopOrSmaller = useIsLaptopOrSmaller()

    return (
        <Container className={styles.pageContainer}>
            <div className={styles.overview}>

                <FadeIn 
                    className={styles.imageContainer}
                    delay={0.1} 
                    amount={0.1} 
                    fadeUpInitial='20%'
                    >
                    <Image src={rocketPic} alt="Futuristic launching to orbit" placeholder="blur" />
                </FadeIn>

                <FadeInList className={styles.content} delay={!isLaptopOrSmaller ? 0.3 : 0.7} amount={0.1}>
                    {children}
                </FadeInList>

                
            </div>
        </Container>
    )
}

export default Overview;