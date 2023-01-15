import { MotionValue, useMotionValue, useScroll } from "framer-motion";
import { createContext, useContext, useRef } from "react";
import styles from "./parallax-container.module.scss";

const ScrollYContext = createContext<MotionValue<number> | null>(null)

/** Provides Y progress value for scroll progres over paralax container */
export const useScrollYContext = () => useContext(ScrollYContext);

// props
interface ParalaxContainerProps {
    children: React.ReactNode
}

/** Container which provides paralax context for paralax blocks */
export const ParalaxContainer = ({ children }: ParalaxContainerProps) => {
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