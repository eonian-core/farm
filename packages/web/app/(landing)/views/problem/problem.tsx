import Container from "../../../components/contrainer/container"
import Image from 'next/image';
import styles from './problem.module.scss'
import BitoinInCrystal from './bitcoin_in_crystal.png'


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
    return (
        <Container mobileFullWidth>
            <Image
                src={BitoinInCrystal}
                alt="Bitcoin in crystal"
                placeholder="blur" 
            />
            <div className={styles.problem}>
                <div className={styles.content}>
                    {children}
                </div>
            </div>
        </Container>
    )
}

export default Problem;