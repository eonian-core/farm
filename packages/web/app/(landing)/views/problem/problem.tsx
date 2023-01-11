import Container from "../../../components/contrainer/container"
import Image from 'next/image';
import styles from './problem.module.scss'
import { Paralax } from "./paralax";
import { useRef, useState } from "react";
import { useGesture } from 'react-use-gesture'


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
    const [positionY, setY] = useState(0)
    const containerRef = useRef(0)
    
    const bind = useGesture({ onWheel: ({ event, movement: [x, y], direction: [dx, dy] }) => {
            console.log('scroll', event, x, y, dx, dy)
            if (y) {
              
              setY(positionY + y / 1000)
            }
          },
        }
      )

    return (
        <Container mobileFullWidth {...bind()}>
            <Paralax positionY={positionY} />
            <div className={styles.problem}>
                <div className={styles.content}>
                    {children}
                </div>
            </div>
        </Container>
    )
}

export default Problem;
