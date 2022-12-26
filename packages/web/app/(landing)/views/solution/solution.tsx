import Container from "../contrainer/container"
import styles from './solution.module.scss'

// Props for the Solution component
interface SolutionProps {
    children: React.ReactNode
}

export const Solution = ({children}: SolutionProps) => {
    return (
        <Container>
            <div className={styles.solution}>
                <div className={styles.content}>
                    {children}
                </div>
            </div>
        </Container>
    )
}

export default Solution;