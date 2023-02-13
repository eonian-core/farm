import Container from "../../../components/contrainer/container"
import FadeIn from "../../../components/fade-in/fade-in"
import { useIsMobileOrSmaller } from "../../../components/resize-hooks/screens"
import WhatIsEonianParallax from "./what-is-eonian-parallax"
import styles from './what-is-eonian.module.scss'


interface WhatIsEonianProps {
    /** content of the block, expected to have: Category, h2 and p elements */
    children: React.ReactNode
}

/** 
 * Block with explanation what is Eonian
 * @param children - content of the block
 */
export const WhatIsEonian = ({children}: WhatIsEonianProps) => {

    const isMobileOrSmaller = useIsMobileOrSmaller()
    
    return (
        <Container className={styles.pageContainer}>
            <div className={styles.wrapper}>
                
                <FadeIn className={styles.textContainer} amount={!isMobileOrSmaller ? 0.5 : 0.2} delay={0.2}>
                    <div className={styles.whatIsEonian}>
                        <div className={styles.content}>
                            {children}
                        </div>
                    </div>
                </FadeIn>

                <WhatIsEonianParallax />
            </div>
        </Container>
    )
}

export default WhatIsEonian;
