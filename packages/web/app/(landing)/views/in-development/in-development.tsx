import Container from "../../../components/contrainer/container";
import FadeInList from "../../../components/fade-in/fade-in-list";
import { useIsTabletOrSmaller } from '../../../components/resize-hooks/screens';
import { useLocalSocials } from '../../../socials';
import InDevelopmentParallax from './in-development-parallax';
import styles from './in-development.module.scss';
import { Socials } from './socials';

interface ContainerProps {
    /** content of the block, expected to have: h2, p  and Card elements */
    children: React.ReactNode
};

export const InDevelopment = ({children}: ContainerProps) => {
    const socials = useLocalSocials()
    const isTabletOrSmaller = useIsTabletOrSmaller()
    
    return (
        <Container className={styles.pageContainer}>
            <div className={styles.inDevelopmentWrapper}>
                <InDevelopmentParallax />
                
                <FadeInList 
                    className={styles.inDevelopment} 
                    childClassName={styles.inDevelopmentChild} 
                    amount={isTabletOrSmaller ? 'some': 0.8}
                    initialDelay={0}
                >
                    {children}

                    <Socials socials={socials} />
                </FadeInList>
            </div>
        </Container>
    );
};

export default InDevelopment;