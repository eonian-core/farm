import React from 'react'
import Image from 'next/image'
import Container from '../../../components/contrainer/container'
import FadeInList from '../../../components/fade-in/fade-in-list'
import FadeIn from '../../../components/fade-in/fade-in'
import { useIsLaptopOrSmaller } from '../../../components/resize-hooks/screens'
import robotPic from './assets/robot.png'
import styles from './approach.module.scss'

export interface ApproachProps {
  children: React.ReactNode
}

export default function Approach({ children }: ApproachProps) {
  const isLaptopOrSmaller = useIsLaptopOrSmaller()

  return (
    <Container className={styles.pageContainer}>
      <div className={styles.approach}>
        <FadeIn
          className={styles.imageContainer}
          delay={!isLaptopOrSmaller ? 0.3 : 0.7}
          amount={0.1}
          fadeUpInitial="20%"
        >
          <Image src={robotPic} alt="robot protecting vault" placeholder="blur" />
        </FadeIn>

        <FadeInList className={styles.description} delay={0.1} amount={0.1}>
          {children}
        </FadeInList>
      </div>
    </Container>
  )
}
