import Image from 'next/image'

import { useLocalSocials } from '../../../socials'
import Container from '../../../components/contrainer/container'
import FadeInList from '../../../components/fade-in/fade-in-list'
import { useIsLaptopOrSmaller, useIsTabletOrSmaller } from '../../../components/resize-hooks/screens'
import { Socials } from '../../../components/socials/socials'

import FadeIn from '../../../components/fade-in/fade-in'
import styles from './revolution.module.scss'
import cityPic from './assets/sci-fi-city-from-golden-lake.png'

interface ContainerProps {
  /** content of the block, expected to have: h2, p  and Card elements */
  children: React.ReactNode
}

export function Revolution({ children }: ContainerProps) {
  const socials = useLocalSocials()
  const isLaptopOrSmaller = useIsLaptopOrSmaller()
  const isTabletOrSmaller = useIsTabletOrSmaller()

  return (
    <Container className={styles.pageContainer}>
      <div className={styles.wrapper}>
        <FadeInList
          className={styles.revolution}
          childClassName={styles.child}
          amount={isTabletOrSmaller ? 0.1 : 0.3}
          initialDelay={0}
        >
          {children}

          <Socials socials={socials} />
        </FadeInList>

        <FadeIn
          className={styles.imageContainer}
          delay={0.3}
          amount={0.1}
          fadeUp={!isLaptopOrSmaller}
          fadeHorizontal={isLaptopOrSmaller}
          fadeHorizontalInitial="20%"
        >
          <Image src={cityPic} alt="Futuristic cityscape view from golden lake" placeholder="blur" />
        </FadeIn>
      </div>
    </Container>
  )
}

export default Revolution
