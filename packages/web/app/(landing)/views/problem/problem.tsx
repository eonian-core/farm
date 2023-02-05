import dynamic from "next/dynamic"
import Container from "../../../components/contrainer/container"
import { useIsMobileOrSmaller } from "../../../components/resize-hooks/screens"
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
    const ProblemParallax = dynamic(import('./problem-parallax'))
    const FadeIn = dynamic(import('../../../components/fade-in/fade-in'))

    const isMobileOrSmaller = useIsMobileOrSmaller()
    
    return (
        <Container className={styles.pageContainer}>
            <div className={styles.problemWrapper}>
                <FadeIn className={styles.problemContainer} amount={!isMobileOrSmaller ? 'all' : 0.3}>
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
