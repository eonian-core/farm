import Image from 'next/image'

import Container from "../../../components/contrainer/container";
import styles from './in-development.module.scss';
import Neon64Pic from './assets/neon-46.png'

interface ContainerProps {
    /** content of the block, expected to have: h2, p  and Card elements */
    children: React.ReactNode
};

export const InDevelopment = ({children}: ContainerProps) => {
    return (
        <Container className={styles.pageContainer}>
            <div className={styles.inDevelopmentWrapper}>
                <div className={styles.inDevelopment}>
                    {children}
                </div>
                <div className={styles.backgroundImage}>
                    <Image src={Neon64Pic} alt="Abstract neon cicrle" placeholder="blur" />
                </div>
            </div>
        </Container>
    );
};

export default InDevelopment;