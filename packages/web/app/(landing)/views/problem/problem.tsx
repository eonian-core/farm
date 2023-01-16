import dynamic from "next/dynamic"
import Container from "../../../components/contrainer/container"
import styles from './problem.module.scss'

// Props for the Problem component
interface ProblemProps {
    /** content of the block, expected to have: Category, h2 and p elements */
    children: React.ReactNode
}

/** 
 * Problem block of the landing page
 * @param children - content of the block
 */
export const Problem = ({children}: ProblemProps) => {
    const ProblemParallax = dynamic(import('./problem-parallax'), { ssr: false })
    
    return (
        <Container mobileFullWidth>
            <div className={styles.problemWrapper}>
                <div className={styles.problem}>
                    <div className={styles.content}>
                        {children}
                    </div>
                </div>
                <ProblemParallax />
            </div>
        </Container>
    )
}

export default Problem;
