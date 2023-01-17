import { MotionValue, useScroll } from "framer-motion";
import { createContext, useContext, useRef } from "react";
import styles from "./parallax-container.module.scss";

const ScrollYContext = createContext<MotionValue<number> | null>(null)

/** Provides Y progress value for scroll progres over parallax container */
export const useScrollYContext = () => useContext(ScrollYContext);

export interface ParallaxContainerProps {
    children: React.ReactNode
}

/** Container which provides parallax context for parallax blocks */
export const ParallaxContainer = ({ children }: ParallaxContainerProps) => {
    const ref = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start end", "end start"],
    });

    return <div ref={ref} className={styles.container}>
        <ScrollYContext.Provider value={scrollYProgress}>
            {children}
        </ScrollYContext.Provider>
    </div>

}

export default ParallaxContainer;