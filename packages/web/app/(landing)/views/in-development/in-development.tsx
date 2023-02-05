import dynamic from 'next/dynamic';
import Image from 'next/image'

import Container from "../../../components/contrainer/container";
import { useIsTabletOrSmaller } from '../../../components/resize-hooks/screens';
import { useLocalSocials } from '../../../socials';
import styles from './in-development.module.scss';
import { Socials } from './socials';

interface ContainerProps {
    /** content of the block, expected to have: h2, p  and Card elements */
    children: React.ReactNode
};

export const InDevelopment = ({children}: ContainerProps) => {
    const socials = useLocalSocials()
    const isTabletOrSmaller = useIsTabletOrSmaller()

    const InDevelopmentParallax = dynamic(import('./in-development-parallax'))
    const FadeInChildren = dynamic(import('../../../components/fade-in/fade-in-children'))
    
    return (
        <Container className={styles.pageContainer}>
            <div className={styles.inDevelopmentWrapper}>
                <InDevelopmentParallax />
                
                <FadeInChildren 
                    className={styles.inDevelopment} 
                    childClassName={styles.inDevelopmentChild} 
                    amount={isTabletOrSmaller ? 0.4 : 0.8}
                >
                    {children}

                    <Socials socials={socials} />
                </FadeInChildren>
            </div>
        </Container>
    );
};

export default InDevelopment;