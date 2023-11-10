import type { PropsWithChildren } from 'react'
import Container from '../../../components/contrainer/container'
import FadeInList from '../../../components/fade-in/fade-in-list'
import { useIsLaptopOrSmaller } from '../../../components/resize-hooks/screens'
import { FadeInImage } from '../../../components/fade-in-image/fade-in-image'
import rocketPic from './assets/rocket-launch.png'
import styles from './overview.module.scss'

export function Overview({ children }: PropsWithChildren) {
  const isLaptopOrSmaller = useIsLaptopOrSmaller()

  return (
        <Container className={styles.pageContainer}>
            <div className={styles.overview}>

                <FadeInImage
                    className={styles.imageContainer}
                    delay={!isLaptopOrSmaller ? 0.1 : 0.7}
                    amount={0.1}
                    fadeUpInitial='20%'
                    src={rocketPic}
                    alt="Futuristic launching to orbit"
                />

                <FadeInList className={styles.content} initialDelay={!isLaptopOrSmaller ? 0.2 : 0.1} delay={0.1} amount={0.1}>
                    {children}
                </FadeInList>

            </div>
        </Container>
  )
}

export default Overview
