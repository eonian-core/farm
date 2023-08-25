import Image from 'next/image';

import { PropsWithChildren } from 'react';
import Container from '../../../components/contrainer/container';
import FadeIn from '../../../components/fade-in/fade-in';
import styles from './who-are-we.module.scss';
import futurePic from './assets/space-rocket-starting-in-scify-city.png';
import FadeInList from '../../../components/fade-in/fade-in-list';
import { useIsLaptopOrSmaller } from '../../../components/resize-hooks/screens';

export const WhoWeAre = ({ children }: PropsWithChildren) => {
  const isLaptopOrSmaller = useIsLaptopOrSmaller();

  return (
    <Container className={styles.pageContainer}>
      <div className={styles.whoAreWe}>
        <FadeInList className={styles.content} delay={0.1} amount={0.1}>
          {children}
        </FadeInList>

        <FadeIn
          className={styles.imageContainer}
          delay={!isLaptopOrSmaller ? 0.3 : 0.7}
          amount={0.1}
          fadeUpInitial="20%"
        >
          <Image src={futurePic} alt="Rocket starting in cityscape of future city" placeholder="blur" />
        </FadeIn>
      </div>
    </Container>
  );
};

export default WhoWeAre;
