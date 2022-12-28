import Container from "../contrainer/container"
import styles from './problem.module.scss'

// Props for the Problem component
interface ProblemProps {
    children: React.ReactNode
}

export const Problem = ({children}: ProblemProps) => {
    return (
        <Container mobileFullWidth>
            <div className={styles.problem}>
                <div className={styles.content}>
                    {children}
                </div>
            </div>
        </Container>
    )
}

export default Problem;