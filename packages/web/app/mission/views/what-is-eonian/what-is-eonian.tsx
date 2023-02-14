import Container from "../../../components/contrainer/container";
import FadeInList from "../../../components/fade-in/fade-in-list";
import { useIsTabletOrSmaller } from '../../../components/resize-hooks/screens';
import InDevelopmentParallax from './what-is-eonian-parallax';
import styles from './what-is-eonian.module.scss';

interface ContainerProps {
    /** content of the block, expected to have: h2, p  and Card elements */
    children: React.ReactNode
};

export const WhatIsEonian = ({ children }: ContainerProps) => {
    const isTabletOrSmaller = useIsTabletOrSmaller()

    return (
        <Container className={styles.pageContainer}>
            <div className={styles.wrapper}>
                <InDevelopmentParallax />

                <FadeInList
                    className={styles.whatIsEonian}
                    childClassName={styles.child}
                    amount={isTabletOrSmaller ? 0.3 : 0.8}
                    initialDelay={0}
                >
                    {children}

                </FadeInList>
            </div>
        </Container>
    );
};

export default WhatIsEonian;