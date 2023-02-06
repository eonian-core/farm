import { useRef } from "react"
import Container from "../../../components/contrainer/container"
import FadeInList from "../../../components/fade-in/fade-in-list"
import { useIsMobileOrSmaller } from '../../../components/resize-hooks/screens'
import SolutionParallax from './solution-parallax'
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
                    <FadeInList className={styles.content} amount={!isMobileOrSmaller ? 0.9 : 'some'} initialDelay={0}>
                        {children}
                    </FadeInList>
                </div>

                <SolutionParallax />

            </div>

        </Container>
    )
}

export default Solution;
