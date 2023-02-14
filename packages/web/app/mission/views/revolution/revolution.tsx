import Image from 'next/image';

import { useLocalSocials } from '../../../socials';
import Container from "../../../components/contrainer/container";
import FadeInList from "../../../components/fade-in/fade-in-list";
import { useIsTabletOrSmaller } from '../../../components/resize-hooks/screens';
import { Socials } from '../../../components/socials/socials';

import styles from './revolution.module.scss';
import cityPic from './assets/sci-fi-city-from-golden-lake.png';

interface ContainerProps {
    /** content of the block, expected to have: h2, p  and Card elements */
    children: React.ReactNode
};

export const Revolution = ({ children }: ContainerProps) => {
    const socials = useLocalSocials()
    const isTabletOrSmaller = useIsTabletOrSmaller()

    return (
        <Container className={styles.pageContainer}>
            <div className={styles.wrapper}>

                <FadeInList
                    className={styles.revolution}
                    childClassName={styles.child}
                    amount={isTabletOrSmaller ? 0.3 : 0.8}
                    initialDelay={0}
                >
                    {children}

                    <Socials socials={socials} />

                </FadeInList>

                <div className={styles.imageContainer}>
                    <Image src={cityPic} alt="Futuristic cityscape view from golden lake" placeholder="blur" />
                </div>
            </div>
        </Container>
    );
};

export default Revolution;