import dynamic from 'next/dynamic'

import Container from "../../../components/contrainer/container"
import styles from './solution.module.scss'

// Props for the Solution component
interface SolutionProps {
    children: React.ReactNode

}

export const Solution = ({ children }: SolutionProps) => {
    const VaultPainting = dynamic(() => import('./vault-painting'))


    return (
        <Container className={styles.pageContainer}>
            <VaultPainting />

            <div className={styles.solutionContainer}>
                <div className={styles.solution}>
                    <div className={styles.content}>
                        {children}
                    </div>
                </div>

            </div>

        </Container>
    )
}

export default Solution;


interface BlockProps {
    children: React.ReactNode
    /** Align number to the end of the block and reverse on small screen sizes*/
    end?: boolean
}

export const Block = ({ children, end }: BlockProps) => {
    return (
        <div className={`${styles.block} ${end ? styles.blockEnd : ''}`}>
            {children}
        </div>
    )
}

// props for BigNumber component
interface BigNumberProps {
    children: React.ReactNode
}


export const BigNumber = ({ children }: BigNumberProps) => {
    return (
        <div className={styles.bigNumber}>
            <span>{children}</span>
        </div>
    )
}