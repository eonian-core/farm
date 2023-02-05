import dynamic from 'next/dynamic'

import Container from "../../../components/contrainer/container"
import styles from './solution.module.scss'

// Props for the Solution component
interface SolutionProps {
    children: React.ReactNode

}

export const Solution = ({ children }: SolutionProps) => {
    const VaultPainting = dynamic(() => import('./vault-painting'))
    const SolutionParallax = dynamic(import('./solution-parallax'), { ssr: false })
    const FadeInChildren = dynamic(() => import('../../../components/fade-in/fade-in-children'))

    return (
        <Container className={styles.pageContainer}>
            <VaultPainting />

            <div className={styles.solutionContainer}>
                <div className={styles.solution}>
                    <FadeInChildren className={styles.content}>
                        {children}
                    </FadeInChildren>
                </div>

                <SolutionParallax />

            </div>

        </Container>
    )
}

export default Solution;
