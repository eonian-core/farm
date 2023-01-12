import Container from "../../../components/contrainer/container"
import Image from 'next/image';
import styles from './problem.module.scss'
import { Paralax } from "./paralax";
import { useContext, useRef, useState, createContext} from "react";
import { useGesture } from 'react-use-gesture'


// Props for the Problem component
interface ProblemProps {
    /** content of the block, expected to have: Category, h2 and p elements */
    children: React.ReactNode
}

export const ScrollContext = createContext(0)

/** 
 * Problem block of the landing page
 * @param children - content of the block
 */
export const Problem = ({children}: ProblemProps) => {
    const scrollTop = useContext(ScrollContext)

    return (
        <Container mobileFullWidth className={styles.problemContainer}>
            <Paralax scrollTop={scrollTop} />
            
            <div className={styles.problem}>
                <div className={styles.content}>
                    {children}
                </div>
            </div>
        </Container>
    )
}

export default Problem;
