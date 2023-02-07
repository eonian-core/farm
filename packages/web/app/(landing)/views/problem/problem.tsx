import Container from "../../../components/contrainer/container"
import FadeIn from "../../../components/fade-in/fade-in"
import { useIsMobileOrSmaller } from "../../../components/resize-hooks/screens"
import ProblemParallax from "./problem-parallax"
import styles from './problem.module.scss'


interface ProblemProps {
    /** content of the block, expected to have: Category, h2 and p elements */
    children: React.ReactNode
}

/** 
 * Problem block of the landing page
 * @param children - content of the block
 */
export const Problem = ({children}: ProblemProps) => {

    const isMobileOrSmaller = useIsMobileOrSmaller()
    
    return (
        <Container className={styles.pageContainer}>
            <div className={styles.problemWrapper}>
                <FadeIn className={styles.problemContainer} amount={!isMobileOrSmaller ? 0.5 : 0.3} delay={0.3}>
                    <div className={styles.problem}>
                        <div className={styles.content}>
                            {children}
                        </div>
                    </div>
                </FadeIn>

                <ProblemParallax />
            </div>
        </Container>
    )
}

export default Problem;
