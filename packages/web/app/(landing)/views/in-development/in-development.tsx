import dynamic from 'next/dynamic';
import Image from 'next/image'

import Container from "../../../components/contrainer/container";
import { useLocalSocials } from '../../../socials';
import styles from './in-development.module.scss';
import { Socials } from './socials';

interface ContainerProps {
    /** content of the block, expected to have: h2, p  and Card elements */
    children: React.ReactNode
};

export const InDevelopment = ({children}: ContainerProps) => {
    const socials = useLocalSocials()

    const InDevelopmentParallax = dynamic(import('./in-development-parallax'))
    return (
        <Container className={styles.pageContainer}>
            <div className={styles.inDevelopmentWrapper}>
                <div className={styles.inDevelopment}>
                    {children}

                    <Socials socials={socials} />
                </div>
                
                <InDevelopmentParallax />
            </div>
        </Container>
    );
};

export default InDevelopment;