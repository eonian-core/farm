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

    return (
        <Container className={styles.pageContainer}>
            <VaultPainting />

            <div className={styles.solutionContainer}>
               

                <div className={styles.solution}>
                    <div className={styles.content}>
                        {children}
                    </div>
                </div>

                <SolutionParallax />

            </div>

        </Container>
    )
}

export default Solution;
