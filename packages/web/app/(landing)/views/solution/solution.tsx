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

// props for Block component
interface BlockProps {
    children: React.ReactNode
    /** Align number to the end of the block and reverse on small screen sizes*/
    end?: boolean
}

export const Block = ({children, end}: BlockProps) => {
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


export const BigNumber = ({children}: BigNumberProps) => {
    return (
        <div className={styles.bigNumber}>
            <span>{children}</span>
        </div>
    )
}