import dynamic from 'next/dynamic';
import Image from 'next/image'

import Container from "../../../components/contrainer/container";
import styles from './in-development.module.scss';

interface ContainerProps {
    /** content of the block, expected to have: h2, p  and Card elements */
    children: React.ReactNode
};

export const InDevelopment = ({children}: ContainerProps) => {
    const InDevelopmentParallax = dynamic(import('./in-development-parallax'))
    return (
        <Container className={styles.pageContainer}>
            <div className={styles.inDevelopmentWrapper}>
                <div className={styles.inDevelopment}>
                    {children}
                </div>
                <InDevelopmentParallax />
            </div>
        </Container>
    );
};

export default InDevelopment;