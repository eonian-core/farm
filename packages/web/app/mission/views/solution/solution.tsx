import Container from "../../../components/contrainer/container"
import FadeInList from "../../../components/fade-in/fade-in-list"
import { useIsMobileOrSmaller } from '../../../components/resize-hooks/screens'
import styles from './solution.module.scss'
import VaultPainting from './vault-painting'

// Props for the Solution component
interface SolutionProps {
    children: React.ReactNode

}

export const Solution = ({ children }: SolutionProps) => {
    const isMobileOrSmaller = useIsMobileOrSmaller()

    return (
        <Container className={styles.pageContainer}>
            <VaultPainting />

            <div className={styles.solutionContainer}>
                <div className={styles.solution} >
                    <FadeInList className={styles.content} amount={!isMobileOrSmaller ? 0.3 : 0.1} initialDelay={0}>
                        {children}
                    </FadeInList>
                </div>

            </div>

        </Container>
    )
}

export default Solution;
